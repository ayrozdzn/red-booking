"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002";

type User = {
  id: string;
  email: string;
  createdAt: string;
};

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    async function loadAccount() {
      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          credentials: "include",
        });

        if (response.status === 401) {
          window.location.assign("/");
          return;
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          setError(data?.error ?? "Impossible de charger votre compte.");
          return;
        }

        setUser(data.user);
      } catch {
        setError("Le serveur est indisponible. Réessayez dans un instant.");
      } finally {
        setIsLoading(false);
      }
    }

    loadAccount();
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      window.location.assign("/");
    } catch {
      setError("Impossible de se déconnecter pour le moment.");
      setIsLoggingOut(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/40 px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,color-mix(in_oklch,var(--primary)_16%,transparent),transparent_42%),radial-gradient(circle_at_bottom_right,color-mix(in_oklch,var(--foreground)_8%,transparent),transparent_38%)]" />

      <Card className="relative w-full max-w-xl border-0 shadow-2xl shadow-primary/10">
        <CardHeader className="gap-3 px-7 pt-8 sm:px-10 sm:pt-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">red booking</p>
          <CardTitle className="text-3xl tracking-tight">Mon compte</CardTitle>
          <CardDescription>Gérez votre session et vos informations de compte.</CardDescription>
        </CardHeader>

        <CardContent className="px-7 sm:px-10">
          {isLoading && <p className="text-sm text-muted-foreground">Chargement du compte...</p>}

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Une erreur est survenue</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {user && (
            <div className="flex flex-col gap-5 rounded-2xl border bg-muted/30 p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Adresse email
                </p>
                <p className="mt-2 text-lg font-medium">{user.email}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Membre depuis
                </p>
                <p className="mt-2 text-sm text-foreground/80">
                  {new Intl.DateTimeFormat("fr-FR", {
                    dateStyle: "long",
                  }).format(new Date(user.createdAt))}
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col gap-3 px-7 pb-8 pt-7 sm:flex-row sm:justify-between sm:px-10 sm:pb-10">
          <Link href="/" className="text-sm font-medium text-primary hover:underline">
            Retour à la connexion
          </Link>
          <Button variant="outline" onClick={handleLogout} disabled={isLoggingOut || !user}>
            {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}