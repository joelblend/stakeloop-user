import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  type ApiErrorPayload,
  type AuthSessionPayload,
  getApiBaseUrl,
} from "@/lib/stakeloop-api";

export const AUTH_COOKIE_NAME = "stakeloop_session";

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

type BackendRequestOptions = {
  body?: unknown;
  headers?: HeadersInit;
  method?: string;
  token?: string | null;
};

type BackendRequestResult<T> = {
  ok: boolean;
  payload: ApiErrorPayload | T | null;
  status: number;
};

function applyBaseHeaders(
  headers: Headers,
  token: string | null | undefined,
  hasBody: boolean,
) {
  headers.set("Accept", "application/json");

  if (hasBody) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

function authCookieConfig(value: string) {
  return {
    httpOnly: true,
    maxAge: AUTH_COOKIE_MAX_AGE,
    name: AUTH_COOKIE_NAME,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    value,
  };
}

export async function requestBackend<T>(
  path: string,
  options: BackendRequestOptions = {},
): Promise<BackendRequestResult<T>> {
  const { body, headers, method = "GET", token } = options;
  const hasBody = body !== undefined;
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    method,
    headers: applyBaseHeaders(new Headers(headers), token, hasBody),
    cache: "no-store",
    body: hasBody ? JSON.stringify(body) : undefined,
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiErrorPayload
    | T
    | null;

  return {
    ok: response.ok,
    payload,
    status: response.status,
  };
}

export const getAuthToken = cache(async function getAuthToken() {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value ?? null;
});

export const getServerSession = cache(async function getServerSession() {
  const token = await getAuthToken();

  if (!token) {
    return null;
  }

  const result = await requestBackend<AuthSessionPayload>("/api/auth/me", {
    token,
  });

  if (!result.ok || !result.payload || !("user" in result.payload)) {
    return null;
  }

  return result.payload;
});

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    ...authCookieConfig(""),
    maxAge: 0,
  });
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(authCookieConfig(token));
}

export function stripToken<T extends { token?: string }>(payload: T): Omit<T, "token"> {
  const nextPayload = { ...payload };
  delete nextPayload.token;
  return nextPayload;
}
