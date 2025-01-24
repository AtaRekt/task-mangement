"use client";
import { ActionResult } from "next/dist/server/app-render/types";
import { useState } from "react";

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

import { Playfair_Display } from "next/font/google";

const playfair_DisplayVariable = Playfair_Display({
    weight: ["400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
});

import { useForm, SubmitHandler } from "react-hook-form";
import { cn } from "@/lib/utils";

type FormData = {
    email: string;
    password: string;
};

export default function LoginForm({ serverAction }: { serverAction: (formData: FormData) => Promise<ActionResult> }) {
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting,
            isValid
        }
    } = useForm({
        defaultValues: {
            email: "",
            password: ""
        },
        mode: "all",
        criteriaMode: "all",
        reValidateMode: "onChange",
    });

    const loginFunc: SubmitHandler<FormData> = async (formData) => {
        setError(null);
        const result = await serverAction(formData);
        if (result?.error) {
            setError(result.error);
        } else {
            setError(null);
        }
    };

    const errorComponent = error ? <>
        <CardContent className="flex items-center justify-center">
            {error && <Label className="text-red-500 text-center">{error}</Label>}
        </CardContent>
    </> : null;

    return (
        <>
            <form onSubmit={handleSubmit(loginFunc)} className="flex flex-col w-96">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className={`text-3xl font-bold ${playfair_DisplayVariable.className} mb-2`}>Giriş</CardTitle>
                        <CardDescription>
                           Devam etmek için lütfen giriş yapın.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">E-posta</Label>
                            <Input {...register("email", { required: true, pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, })} placeholder="E-posta adresiniz..." className={cn(`outline-none ${errors?.email ? 'border-red-500' : ''}`)} />
                            {errors.email?.type === "required" && (
                                <Label className="text-red-500">E-posta gerekli.</Label>
                            )}
                            {errors.email?.type === "pattern" && (
                                <Label className="text-red-500">Geçerli bir e-posta adresi girin.</Label>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input {...register("password", { required: true, minLength: 6 })} type="password" placeholder="Şifreniz..." className={cn(`outline-none ${errors?.password ? 'border-red-500' : ''}`)} />
                            {errors.password?.type === "required" && (
                                <Label className="text-red-500 text-xs font-normal">Şifre gerekli.</Label>
                            )}
                            {errors.password?.type === "minLength" && (
                                <Label className="text-red-500 text-xs font-normal">Şifre en az 6 karakter olmalıdır.</Label>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className={`w-full ${isSubmitting && "disabled opacity-50"}  ${!isValid && "disabled opacity-50"}`} disabled={!isValid}>{isSubmitting ? "Yükleniyor..." : "Giriş Yap"}</Button>
                    </CardFooter>
                    {errorComponent}
                </Card>
            </form>
        </>
    );
}