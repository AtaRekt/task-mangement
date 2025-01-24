import { verify } from "@node-rs/argon2";
import { cookies } from "next/headers";
import { lucia } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ActionResult } from "next/dist/server/app-render/types";

import { db } from "@/db";

import { userTable } from "@/db/schema";

import { eq } from "drizzle-orm";

interface FormData {
    email: string;
    password: string;
}

export async function login(formData: FormData): Promise<ActionResult> {
    "use server";
    const email = formData?.email;
    if (
        typeof email !== "string"
    ) {
        return {
            error: "Invalid email"
        };
    }
    const password = formData.password;
    if (typeof password !== "string" || password.length < 6 || password.length > 255) {
        return {
            error: "Invalid password"
        };
    }

    const existingUser = await db.query.userTable.findFirst({
        where: eq(userTable.email, email.toLowerCase())
    });

    if (!existingUser) {
        return {
            error: "E-posta veya şifre hatalı"
        };
    }

    const validPassword = await verify(existingUser.password_hash, password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1
    });
    if (!validPassword) {
        return {
            error: "E-posta veya şifre hatalı"
        };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return redirect("/dashboard");
}