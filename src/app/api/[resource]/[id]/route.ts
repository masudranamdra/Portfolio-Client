import { NextRequest } from 'next/server';
import { deleteResource, getResource, updateResource } from '../../../../lib/content-api';
import type { ResourceName } from '../../../../types/content';

// Force dynamic route to prevent static analysis during build
export const dynamic = 'force-dynamic';

const resources = ['projects', 'blogs', 'skills', 'testimonials', 'activities', 'articles', 'messages', 'documents', 'config'];

const validResource = (resource: string): resource is ResourceName => resources.includes(resource);

export async function GET(request: NextRequest, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  if (!validResource(resource)) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  return getResource(request, resource, id);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  if (!validResource(resource)) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  return updateResource(request, resource, id);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ resource: string; id: string }> }) {
  const { resource, id } = await params;
  if (!validResource(resource)) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  return deleteResource(request, resource, id);
}
