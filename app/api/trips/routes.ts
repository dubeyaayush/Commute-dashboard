import { NextRequest, NextResponse } from 'next/server';
import { fetchTrips } from '@/lib/api';

// Server-side proxy so client components can load trips without exposing the
// API key. Reads ?volunteer= and forwards to the backend via the server helper.
export async function GET(req: NextRequest) {
  const volunteer = req.nextUrl.searchParams.get('volunteer') ?? undefined;
  try {
    const data = await fetchTrips({ volunteer, limit: 500 });
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed' },
      { status: 500 },
    );
  }
}