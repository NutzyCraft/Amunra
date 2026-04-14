import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getSql() {
	if (!process.env.DATABASE_URL) {
		throw new Error("DATABASE_URL is missing.");
	}

	return neon(process.env.DATABASE_URL);
}

function isValidEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function isValidUuid(value) {
	return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
		String(value || "").trim()
	);
}

function normalizeAddressRow(row) {
	if (!row) return null;

	return {
		id: Number(row.id),
		name: String(row.name || ""),
		phone: String(row.phone || ""),
		line1: String(row.line1 || ""),
		line2: String(row.line2 || ""),
		city: String(row.city || ""),
		postalCode: Number(row.postal_code),
		userId: String(row.user_id || ""),
	};
}

async function resolveUserId(sql, userId, email) {
	const normalizedUserId = String(userId || "").trim();
	if (normalizedUserId && isValidUuid(normalizedUserId)) {
		return normalizedUserId;
	}

	const normalizedEmail = String(email || "").trim().toLowerCase();
	if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
		return "";
	}

	const users = await sql`
		select id
		from neon_auth."user"
		where email = ${normalizedEmail}
		limit 1
	`;

	if (!users?.length) {
		return "";
	}

	return String(users[0].id || "");
}

function validateAddressPayload(body) {
	const name = String(body?.name || "").trim();
	const line1 = String(body?.line1 || "").trim();
	const line2 = String(body?.line2 || "").trim();
	const city = String(body?.city || "").trim();
	const phone = String(body?.phone || "").replace(/\D/g, "").trim();
	const postalCodeText = String(body?.postalCode || "").trim();
	const postalCode = Number.parseInt(postalCodeText, 10);

	if (!name || !phone || !line1 || !city || !postalCodeText) {
		return { error: "Name, phone, line 1, city and postal code are required." };
	}

	if (phone.length < 10 || phone.length > 10) {
		return { error: "Phone number must contain 10 digits." };
	}

	if (!Number.isInteger(postalCode)) {
		return { error: "Postal code must be a valid number." };
	}

    if (postalCode < 10000 || postalCode > 99999) {
        return { error: "Postal code must be a 5-digit number." };
    }

	return {
		address: {
			name,
			phone,
			line1,
			line2,
			city,
			postalCode,
		},
	};
}

async function upsertAddress(request) {
	try {
		const body = await request.json();
		const sql = getSql();
		const resolvedUserId = await resolveUserId(sql, body?.userId, body?.email);

		if (!resolvedUserId) {
			return NextResponse.json(
				{ message: "Unable to resolve the logged-in user for this address." },
				{ status: 400 }
			);
		}

		const validation = validateAddressPayload(body);
		if (validation.error) {
			return NextResponse.json({ message: validation.error }, { status: 400 });
		}

		const { address } = validation;

		const existingRows = await sql`
			select id
			from addresses
			where user_id = ${resolvedUserId}
			order by id desc
			limit 1
		`;

		if (existingRows?.length) {
			const existingId = Number(existingRows[0].id);
			const updatedRows = await sql`
				update addresses
				set
					name = ${address.name},
					phone = ${address.phone},
					line1 = ${address.line1},
					line2 = ${address.line2},
					city = ${address.city},
					postal_code = ${address.postalCode}
				where id = ${existingId}
				returning id, name, phone, line1, line2, city, postal_code, user_id
			`;

			return NextResponse.json(
				{ message: "Address updated successfully.", data: normalizeAddressRow(updatedRows?.[0]) },
				{ status: 200 }
			);
		}

		const insertedRows = await sql`
			insert into addresses (name, phone, line1, line2, city, postal_code, user_id)
			values (${address.name}, ${address.phone}, ${address.line1}, ${address.line2}, ${address.city}, ${address.postalCode}, ${resolvedUserId})
			returning id, name, phone, line1, line2, city, postal_code, user_id
		`;

		return NextResponse.json(
			{ message: "Address saved successfully.", data: normalizeAddressRow(insertedRows?.[0]) },
			{ status: 201 }
		);
	} catch (error) {
		if (error instanceof Error && error.message.includes("DATABASE_URL")) {
			return NextResponse.json(
				{ message: "Missing DATABASE_URL environment variable." },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: "Unable to save address at the moment." },
			{ status: 500 }
		);
	}
}

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const userId = searchParams.get("userId") || "";
		const email = searchParams.get("email") || "";
		const sql = getSql();
		const resolvedUserId = await resolveUserId(sql, userId, email);

		if (!resolvedUserId) {
			return NextResponse.json(
				{ message: "Unable to resolve the logged-in user for this address." },
				{ status: 400 }
			);
		}

		const rows = await sql`
			select id, name, phone, line1, line2, city, postal_code, user_id
			from addresses
			where user_id = ${resolvedUserId}
			order by id desc
			limit 1
		`;

		return NextResponse.json(
			{ message: "Address fetched successfully.", data: normalizeAddressRow(rows?.[0]) },
			{ status: 200 }
		);
	} catch (error) {
		if (error instanceof Error && error.message.includes("DATABASE_URL")) {
			return NextResponse.json(
				{ message: "Missing DATABASE_URL environment variable." },
				{ status: 500 }
			);
		}

		return NextResponse.json(
			{ message: "Unable to fetch address at the moment." },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	return upsertAddress(request);
}

export async function PUT(request) {
	return upsertAddress(request);
}
