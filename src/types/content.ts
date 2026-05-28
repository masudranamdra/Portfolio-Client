export type ResourceName =
  | 'projects'
  | 'blogs'
  | 'skills'
  | 'testimonials'
  | 'activities'
  | 'articles'
  | 'messages'
  | 'documents'
  | 'config';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
}

