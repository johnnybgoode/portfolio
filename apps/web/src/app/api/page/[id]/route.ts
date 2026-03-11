import { fetchPage } from '@portfolio/notion';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Page ID is required.' },
      { status: 400 },
    );
  }

  try {
    const data = await fetchPage(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch page.' },
      { status: 500 },
    );
  }
}
