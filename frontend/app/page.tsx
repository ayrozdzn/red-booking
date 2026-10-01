"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";

export default function Home() {
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
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, rememberMe }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error ?? "Impossible de se connecter.");
        return;
      }

      window.location.assign("/");
    } catch {
      setError("Le serveur est indisponible. Réessayez dans un instant.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/40 px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_42%),radial-gradient(circle_at_bottom_right,color-mix(in_oklch,var(--foreground)_8%,transparent),transparent_38%)]" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border bg-card shadow-2xl shadow-primary/10 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground lg:flex">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">red booking</p>
            <h1 className="mt-20 max-w-sm text-5xl font-semibold leading-[1.05] tracking-tight">
              Vos réservations, au bon moment.
            </h1>
          </div>
          <p className="max-w-xs text-sm leading-6 text-primary-foreground/70">
            Retrouvez votre espace et gérez vos disponibilités depuis un seul endroit.
          </p>
        </section>

        <Card className="rounded-none border-0 shadow-none">
          <CardHeader className="gap-3 px-7 pt-8 sm:px-12 sm:pt-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary lg:hidden">
              red booking
            </p>
            <CardTitle className="text-3xl tracking-tight">Bon retour</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à votre espace de réservation.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="px-7 sm:px-12">
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
                    autoComplete="current-password"
                    placeholder="Votre mot de passe"
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
                    <FieldDescription>
                      À activer uniquement sur un appareil personnel.
                    </FieldDescription>
                  </FieldContent>
                </Field>

                {error && (
                  <Alert variant="destructive">
                    <AlertTitle>Connexion impossible</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </FieldGroup>
            </CardContent>

            <CardFooter className="flex-col gap-4 px-7 pb-8 pt-7 sm:px-12 sm:pb-12">
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Connexion..." : "Se connecter"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Vous n&apos;avez pas encore de compte ?{" "}
                <Link href="/register" className="font-medium text-primary hover:underline">
                  Créer un compte
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
