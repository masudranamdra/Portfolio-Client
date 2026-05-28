import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { auth } from './auth';
import { getDb } from './mongodb';
import { isAdminEmail } from './admin';
import type { ResourceName } from '../types/content';

const collectionMap: Record<ResourceName | 'images' | 'videos', string> = {
  projects: 'projects',
  blogs: 'blogs',
  skills: 'skills',
  testimonials: 'testimonials',
  activities: 'activities',
  articles: 'articles',
  messages: 'messages',
  images: 'images',
  videos: 'videos',
  documents: 'documents',
  config: 'config',
};

const publicRead = new Set<ResourceName>([
  'projects',
  'blogs',
  'skills',
  'testimonials',
  'activities',
  'articles',
  'documents',
  'config',
]);

const normalizeId = (doc: any) => ({
  ...doc,
  _id: doc._id?.toString?.() || doc._id,
});

const getSession = (request: NextRequest) =>
  auth.api.getSession({ headers: request.headers });

const assertCanRead = async (request: NextRequest, resource: ResourceName | 'images' | 'videos') => {
  if (publicRead.has(resource as ResourceName)) return null;
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Please log in to continue' }, { status: 401 });
  }
  return null;
};

const assertAdmin = async (request: NextRequest) => {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ success: false, message: 'Please log in to continue' }, { status: 401 });
  }
  if (!isAdminEmail(session.user.email)) {
    return NextResponse.json({ success: false, message: 'Administrator access required' }, { status: 403 });
  }
  return null;
};

const cleanPayload = (payload: any, resource: ResourceName | 'images' | 'videos') => {
  const data = { ...payload };
  delete data._id;
  delete data.id;

  if (typeof data.tags === 'string') {
    data.tags = data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
  }

  if (resource === 'images') {
    data.url = data.url || data.imageUrl;
    data.title = data.title || data.description || 'Untitled image';
    data.category = data.category || 'Gallery';
    data.description = data.description || data.title;
    delete data.imageUrl;
  }

  if (resource === 'videos') {
    data.url = data.url || data.videoUrl;
    data.platform = data.platform || (String(data.url || '').includes('drive.google.com') ? 'GoogleDrive' : 'YouTube');
    
    // Auto-generate thumbnail for YouTube videos if not provided
    if (!data.thumbnail && data.platform === 'YouTube') {
      const match = String(data.url || '').match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/);
      const ytId = match ? match[1] : '';
      if (ytId) {
        data.thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    }
    
    delete data.videoUrl;
  }

  if (resource === 'documents') {
    data.category = data.category || 'Documents';
    data.documentType = data.documentType || 'PDF';
    data.fileSize = data.fileSize || 'N/A';
    data.author = data.author || 'Masud Rana';
  }

  data.updatedAt = new Date();
  return data;
};

export const listResource = async (request: NextRequest, resource: ResourceName | 'images' | 'videos') => {
  const readError = await assertCanRead(request, resource);
  if (readError) return readError;

  const db = await getDb();
  const docs = await db
    .collection(collectionMap[resource])
    .find({})
    .sort({ createdAt: -1, _id: -1 })
    .toArray();

  return NextResponse.json({
    success: true,
    count: docs.length,
    data: docs.map(normalizeId),
  });
};

export const getResource = async (request: NextRequest, resource: ResourceName | 'images' | 'videos', id: string) => {
  const readError = await assertCanRead(request, resource);
  if (readError) return readError;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: 'Invalid item id' }, { status: 400 });
  }

  const db = await getDb();
  const doc = await db.collection(collectionMap[resource]).findOne({ _id: new ObjectId(id) });

  if (!doc) {
    return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: normalizeId(doc) });
};

export const createResource = async (request: NextRequest, resource: ResourceName | 'images' | 'videos') => {
  const adminError = await assertAdmin(request);
  if (adminError) return adminError;

  const body = await request.json();
  const data = {
    ...cleanPayload(body, resource),
    createdAt: new Date(),
  };

  const db = await getDb();
  const result = await db.collection(collectionMap[resource]).insertOne(data);
  return NextResponse.json({ success: true, data: normalizeId({ ...data, _id: result.insertedId }) }, { status: 201 });
};

export const updateResource = async (request: NextRequest, resource: ResourceName | 'images' | 'videos', id: string) => {
  const adminError = await assertAdmin(request);
  if (adminError) return adminError;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: 'Invalid item id' }, { status: 400 });
  }

  const body = await request.json();
  const data = cleanPayload(body, resource);
  const db = await getDb();
  const result = await db
    .collection(collectionMap[resource])
    .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: data }, { returnDocument: 'after' });

  if (!result) {
    return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: normalizeId(result) });
};

export const deleteResource = async (request: NextRequest, resource: ResourceName | 'images' | 'videos', id: string) => {
  const adminError = await assertAdmin(request);
  if (adminError) return adminError;

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: 'Invalid item id' }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection(collectionMap[resource]).deleteOne({ _id: new ObjectId(id) });

  if (!result.deletedCount) {
    return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: {}, message: 'Deleted successfully' });
};
