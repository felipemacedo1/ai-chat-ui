"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAuthContext } from "../context/AuthContext";
import { authService } from "../services/authService";
import { LoginRequest, RegisterRequest } from "../dto/request";

interface FieldError {
  field: string;
  message: string;
}

interface ApiErrorResponse {
  message?: string;
  errors?: FieldError[];
}

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading: authLoading, setAuth, clearAuth } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearErrors = useCallback(() => {
    setError(null);
    setFieldErrors({});
  }, []);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof AxiosError) {
      const data = err.response?.data as ApiErrorResponse | undefined;
      if (data?.errors && data.errors.length > 0) {
        const errors: Record<string, string> = {};
        data.errors.forEach((e) => {
          errors[e.field] = e.message;
        });
        setFieldErrors(errors);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError("An unexpected error occurred");
      }
    } else {
      setError("An unexpected error occurred");
    }
  }, []);


  const handleLogin = useCallback(
    async (data: LoginRequest) => {
      setIsLoading(true);
      clearErrors();
      try {
        const response = await authService.login(data);
        setAuth(response.user, response.accessToken);
        router.push("/");
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [setAuth, router, clearErrors, handleError]
  );

  const handleRegister = useCallback(
    async (data: RegisterRequest) => {
      setIsLoading(true);
      clearErrors();
      try {
        const response = await authService.register(data);
        setAuth(response.user, response.accessToken);
        router.push("/");
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    [setAuth, router, clearErrors, handleError]
  );

  const handleLogout = useCallback(async () => {
    setIsLoading(true);
    clearErrors();
    try {
      await authService.logout();
    } catch {
      // Ignore logout errors - clear auth anyway
    } finally {
      clearAuth();
      setIsLoading(false);
      router.push("/login");
    }
  }, [clearAuth, router, clearErrors]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading: isLoading || authLoading,
    error,
    fieldErrors,
    handleLogin,
    handleRegister,
    handleLogout,
    clearErrors,
  };
}
