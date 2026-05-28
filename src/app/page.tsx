import React from 'react';
import dynamic from 'next/dynamic';
import Navbar from '../components/Navbar';
import Hero from '../sections/Hero';
import Footer from '../components/Footer';
import SectionSkeleton from '../components/SectionSkeleton';

// Dynamically load below-the-fold sections with beautiful custom skeleton fallbacks
const About = dynamic(() => import('../sections/About').then((m) => m.About), {
  loading: () => <SectionSkeleton hasGrid={false} height="h-80" />,
});

const Projects = dynamic(() => import('../sections/Projects').then((m) => m.default), {
  loading: () => <SectionSkeleton gridCols={3} height="h-64" />,
});

const Experience = dynamic(() => import('../sections/Experience').then((m) => m.Experience), {
  loading: () => <SectionSkeleton hasGrid={false} height="h-96" />,
});

const Skills = dynamic(() => import('../sections/Skills').then((m) => m.Skills), {
  loading: () => <SectionSkeleton gridCols={4} height="h-32" />,
});

const Testimonials = dynamic(() => import('../sections/Testimonials').then((m) => m.default), {
  loading: () => <SectionSkeleton gridCols={2} height="h-48" />,
});

const BlogSection = dynamic(() => import('../sections/Blog').then((m) => m.default), {
  loading: () => <SectionSkeleton gridCols={3} height="h-60" />,
});

const Activities = dynamic(() => import('../sections/Activities').then((m) => m.default), {
  loading: () => <SectionSkeleton hasGrid={false} height="h-96" />,
});

const Articles = dynamic(() => import('../sections/Articles').then((m) => m.default), {
  loading: () => <SectionSkeleton gridCols={3} height="h-56" />,
});

const Contact = dynamic(() => import('../sections/Contact').then((m) => m.Contact), {
  loading: () => <SectionSkeleton hasGrid={false} height="h-80" />,
});

export default function Home() {
  return (
    <main className="relative min-h-screen">
      {/* Floating Header Navbar */}
      <Navbar />

      {/* Landing page sections */}
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <Testimonials />
      <BlogSection />
      <Activities />
      <Articles />
      <Contact />

      {/* Page Footer */}
      <Footer />
    </main>
  );
}
