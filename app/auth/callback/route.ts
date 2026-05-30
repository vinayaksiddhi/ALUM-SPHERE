import { createSupabaseServerClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")

  if (code) {
    const supabase = await createSupabaseServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // Redirect to home page — the client will detect the session and show role modal or dashboard
      return NextResponse.redirect(`${origin}/`)
    }
  }

  // If something went wrong, redirect to home with error param
  return NextResponse.redirect(`${origin}/?auth_error=1`)
}
