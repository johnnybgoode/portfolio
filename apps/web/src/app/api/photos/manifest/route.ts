import { NextResponse } from 'next/server';
import type { Manifest } from '../../../../types/photos';

export async function GET() {
  const publicUrl = process.env.R2_PUBLIC_URL;
  if (!publicUrl) {
    return NextResponse.json(
      { error: 'R2_PUBLIC_URL not configured.' },
      { status: 500 },
    );
  }

  try {
    const res = await fetch(`${publicUrl}/manifest.json`, {
      next: { revalidate: 0 },
    });
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch manifest.' },
        { status: 502 },
      );
    }
    const manifest: Manifest = await res.json();
    return NextResponse.json(manifest);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch manifest.' },
      { status: 500 },
    );
  }
}
