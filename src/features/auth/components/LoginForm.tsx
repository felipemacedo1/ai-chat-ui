"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Card, Label, TextInput, Button, Alert, HelperText } from "flowbite-react";
import { useAuth } from "../hooks/useAuth";

export function LoginForm() {
  const { handleLogin, isLoading, error, fieldErrors, clearErrors } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await handleLogin({ email, password });
  };

  return (
    <Card className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Sign in to your account
      </h2>

      {error && (
        <Alert color="failure" onDismiss={clearErrors}>
          {error}
        </Alert>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="email">Email</Label>
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            color={fieldErrors.email ? "failure" : undefined}
            required
          />
          {fieldErrors.email && (
            <HelperText color="failure">{fieldErrors.email}</HelperText>
          )}
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="password">Password</Label>
          </div>
          <TextInput
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            color={fieldErrors.password ? "failure" : undefined}
            required
          />
          {fieldErrors.password && (
            <HelperText color="failure">{fieldErrors.password}</HelperText>
          )}
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-blue-600 hover:underline dark:text-blue-500"
        >
          Sign up
        </Link>
      </p>
    </Card>
  );
}
