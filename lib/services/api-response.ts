import { NextResponse } from "next/server";

export function ok<T>(data: T, meta?: Record<string, unknown>, status = 200) {
  return NextResponse.json({ success: true, data, meta }, { status });
}

export function fail(code: string, message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: { code, message, details } }, { status });
}
