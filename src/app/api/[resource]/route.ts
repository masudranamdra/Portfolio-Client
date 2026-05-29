import { NextRequest } from 'next/server';
import { createResource, listResource } from '../../../lib/content-api';
import type { ResourceName } from '../../../types/content';

// Force dynamic route to prevent static analysis during build
export const dynamic = 'force-dynamic';

const resources = ['projects', 'blogs', 'skills', 'testimonials', 'activities', 'articles', 'messages', 'documents', 'config'];

const validResource = (resource: string): resource is ResourceName => resources.includes(resource);

export async function GET(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!validResource(resource)) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  return listResource(request, resource);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!validResource(resource)) return Response.json({ success: false, message: 'Not found' }, { status: 404 });
  return createResource(request, resource);
}
