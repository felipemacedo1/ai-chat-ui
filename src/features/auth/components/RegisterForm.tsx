"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { Card, Label, TextInput, Button, Alert, HelperText } from "flowbite-react";
import { useAuth } from "../hooks/useAuth";

export function RegisterForm() {
  const { handleRegister, isLoading, error, fieldErrors, clearErrors } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    await handleRegister({ name, email, password });
  };

  const displayError = localError || error;

  return (
    <Card className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Create an account
      </h2>

      {displayError && (
        <Alert color="failure" onDismiss={() => { clearErrors(); setLocalError(null); }}>
          {displayError}
        </Alert>
      )}

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="name">Name</Label>
          </div>
          <TextInput
            id="name"
            type="text"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            color={fieldErrors.name ? "failure" : undefined}
            required
          />
          {fieldErrors.name && (
            <HelperText color="failure">{fieldErrors.name}</HelperText>
          )}
        </div>

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

        <div>
          <div className="mb-2 block">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
          </div>
          <TextInput
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
    
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-500">
            Sign in
          </Link>
        </div>
      </form>
    </Card>
  );
}
