import { NextRequest } from 'next/server';
import { deleteResource, updateResource } from '../../../../../lib/content-api';

const validKind = (kind: string): kind is 'images' | 'videos' => kind === 'images' || kind === 'videos';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  if (!validKind(kind)) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  return updateResource(request, kind, id);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ kind: string; id: string }> }) {
  const { kind, id } = await params;
  if (!validKind(kind)) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  return deleteResource(request, kind, id);
}
