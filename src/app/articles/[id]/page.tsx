'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Button } from '../../../components/Button';
import api from '../../../services/api';

interface Article {
  _id: string;
  title: string;
  description: string;
  externalLink?: string;
  thumbnail?: string;
  readTime?: string;
  category?: string;
}

export default function ArticleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const [article, setArticle] = useState<Article | null>(null);

  useEffect(() => {
    params.then(({ id }) => api.get(`/articles/${id}`).then((res) => setArticle(res.data?.data || null)));
  }, [params]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-28 pb-20">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/articles" className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-500">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Articles
          </Link>
          {article && (
            <>
              {article.thumbnail && <img src={article.thumbnail} alt={article.title} className="mb-8 h-80 w-full rounded-2xl object-cover" />}
              <div className="mb-4 flex gap-3 text-sm font-semibold text-slate-500 dark:text-slate-400">
                {article.category && <span className="rounded-full bg-sky-500/10 px-3 py-1 text-sky-500">{article.category}</span>}
                {article.readTime && <span>{article.readTime}</span>}
              </div>
              <h1 className="text-4xl font-black text-slate-950 dark:text-white">{article.title}</h1>
              <p className="mt-6 text-lg leading-8 text-slate-700 dark:text-slate-300">{article.description}</p>
              {article.externalLink && (
                <a href={article.externalLink} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex">
                  <Button className="gap-2">
                    Read Original
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              )}
            </>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
