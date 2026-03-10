import { fetchBlocks } from '@portfolio/notion';
import { NextResponse } from 'next/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: 'Block ID is required.' },
      { status: 400 },
    );
  }

  try {
    const data = await fetchBlocks(id);
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Failed to fetch blocks.' },
      { status: 500 },
    );
  }
}
