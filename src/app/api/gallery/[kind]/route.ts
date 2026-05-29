import { NextRequest } from 'next/server';
import { createResource, listResource } from '../../../../lib/content-api';

// Force dynamic route to prevent static analysis during build
export const dynamic = 'force-dynamic';

const validKind = (kind: string): kind is 'images' | 'videos' => kind === 'images' || kind === 'videos';

export async function GET(request: NextRequest, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!validKind(kind)) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  return listResource(request, kind);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ kind: string }> }) {
  const { kind } = await params;
  if (!validKind(kind)) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  return createResource(request, kind);
}
