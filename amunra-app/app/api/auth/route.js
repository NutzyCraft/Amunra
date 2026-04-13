import { createAuthServer } from "@neondatabase/auth/next/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function getAuthServer() {
	if (!process.env.NEON_AUTH_BASE_URL) {
		throw new Error("NEON_AUTH_BASE_URL is missing.");
	}

	return createAuthServer();
}

function isValidEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

function formatAuthError(error, fallbackMessage) {
	if (!error) return fallbackMessage;
	if (typeof error === "string") return error;
	if (typeof error?.message === "string") return error.message;
	return fallbackMessage;
}

export async function POST(request) {
	try {
		const body = await request.json();
		const fullName = String(body?.fullName || "").trim();
		const email = String(body?.email || "").trim().toLowerCase();
		const password = String(body?.password || "");
		const confirmPassword = String(body?.confirmPassword || "");

		if (!fullName || !email || !password || !confirmPassword) {
			return NextResponse.json({ message: "All fields are required." }, { status: 400 });
		}

		if (!isValidEmail(email)) {
			return NextResponse.json({ message: "Please provide a valid email address." }, { status: 400 });
		}

		if (password.length < 8) {
			return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
		}

		if (password !== confirmPassword) {
			return NextResponse.json({ message: "Passwords do not match." }, { status: 400 });
		}

		const authServer = getAuthServer();
		const result = await authServer.signUp.email({
			email,
			password,
			name: fullName,
		});

		if (result?.error) {
			const status = Number(result?.error?.status) || 400;
			return NextResponse.json(
				{ message: formatAuthError(result.error, "Unable to register user.") },
				{ status }
			);
		}

		return NextResponse.json({ message: "Account created successfully.", data: result?.data }, { status: 201 });
	} catch (error) {
		if (error instanceof Error && error.message.includes("NEON_AUTH_BASE_URL")) {
			return NextResponse.json({ message: "Missing NEON_AUTH_BASE_URL environment variable." }, { status: 500 });
		}

		return NextResponse.json({ message: "Unable to process registration request." }, { status: 500 });
	}
}

export async function PUT(request) {
	try {
		const body = await request.json();
		const email = String(body?.email || "").trim().toLowerCase();
		const password = String(body?.password || "");

		if (!email || !password) {
			return NextResponse.json({ message: "Email and password are required." }, { status: 400 });
		}

		const authServer = getAuthServer();
		const result = await authServer.signIn.email({ email, password });

		if (result?.error) {
			const status = Number(result?.error?.status) || 401;
			return NextResponse.json(
				{ message: formatAuthError(result.error, "Invalid email or password.") },
				{ status }
			);
		}

		return NextResponse.json({ message: "Login successful.", data: result?.data }, { status: 200 });
	} catch (error) {
		if (error instanceof Error && error.message.includes("NEON_AUTH_BASE_URL")) {
			return NextResponse.json({ message: "Missing NEON_AUTH_BASE_URL environment variable." }, { status: 500 });
		}

		return NextResponse.json({ message: "Unable to process login request." }, { status: 500 });
	}
}
