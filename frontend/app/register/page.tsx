"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
}
from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, rememberMe }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error ?? "Impossible de créer le compte.");
        return;
      }

      window.location.assign("/account");
    } catch {
      setError("Le serveur est indisponible. Réessayez dans un instant.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/40 px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_42%),radial-gradient(circle_at_bottom_right,color-mix(in_oklch,var(--foreground)_8%,transparent),transparent_38%)]" />

      <Card className="relative w-full max-w-lg border-0 shadow-2xl shadow-primary/10">
        <CardHeader className="gap-3 px-7 pt-8 sm:px-10 sm:pt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">red booking</p>
          <CardTitle className="text-3xl tracking-tight">Créer votre compte</CardTitle>
          <CardDescription>
            Commencez à organiser vos réservations en quelques secondes.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="px-7 sm:px-10">
            <FieldGroup className="gap-5">
              <Field>
                <FieldLabel htmlFor="email">Adresse email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="8 caractères minimum"
                  minLength={8}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Field>

              <Field orientation="horizontal" className="items-start gap-3">
                <Checkbox
                  id="remember-me"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <FieldContent className="gap-1">
                  <FieldLabel htmlFor="remember-me">Rester connecté 30 jours</FieldLabel>
                  <FieldDescription>À activer sur un appareil personnel.</FieldDescription>
                </FieldContent>
              </Field>

              {error && (
                <Alert variant="destructive">
                  <AlertTitle>Création impossible</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </FieldGroup>
          </CardContent>

          <CardFooter className="flex-col gap-4 px-7 pb-8 pt-7 sm:px-10 sm:pb-10">
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Création..." : "Créer mon compte"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <Link href="/" className="font-medium text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}