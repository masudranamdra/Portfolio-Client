'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote, Award } from 'lucide-react';
import { SectionHeader } from '../components/SectionHeader';
import { GlassCard } from '../components/GlassCard';
import api from '../services/api';

interface Testimonial {
  _id: string;
  clientName: string;
  role: string;
  rating: number;
  reviewText: string;
  clientImage: string;
  project?: string;
  whyChoseMe?: string;
}

const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    _id: 't1',
    clientName: 'Sarah Jenkins',
    role: 'CTO at CloudBase Solutions',
    rating: 5,
    reviewText: 'Masud is a stellar engineer. He refactored our legacy React platform into Next.js, resulting in a 40% speed increase and substantial improvements in core web vitals. Highly professional and autonomous.',
    clientImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80',
    project: 'CloudBase Enterprise Portal',
    whyChoseMe: 'Strong Next.js architectural patterns and proven database optimization history.'
  },
  {
    _id: 't2',
    clientName: 'Aris Thorne',
    role: 'Product Lead at Apex Labs',
    rating: 5,
    reviewText: 'His grasp of animations (Framer Motion) and bento layout systems is exceptional. Masud took our raw wireframes and delivered a premium, high-converting product UI. 10/10 recommendation.',
    clientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    project: 'Apex Analytics Dashboard',
    whyChoseMe: 'Attention to detail in responsive styling and fluid transition layouts.'
  },
  {
    _id: 't3',
    clientName: 'David Lee',
    role: 'Founder of Nova AI',
    rating: 5,
    reviewText: 'Masud integrated our Express.js backend with complex Mongoose pipelines. His clean, structured API setup saved our front-end team weeks of boilerplate development.',
    clientImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    project: 'Nova AI Integration Core',
    whyChoseMe: 'Depth of knowledge in Express server architectures and scalable aggregate query flows.'
  }
];

export const Testimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1: left, 1: right
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get('/testimonials');
        if (res.data && res.data.success && res.data.data.length > 0) {
          setTestimonials(res.data.data);
        } else {
          setTestimonials(MOCK_TESTIMONIALS);
        }
      } catch (err) {
        console.warn('API error, using mock testimonials:', err);
        setTestimonials(MOCK_TESTIMONIALS);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto slide interval
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [activeIndex, testimonials]);

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  if (loading || testimonials.length === 0) {
    return null;
  }

  const current = testimonials[activeIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 80 : -80,
      opacity: 0,
    }),
  };

  return (
    <section id="testimonials" className="py-20 relative overflow-hidden bg-slate-100/30 dark:bg-gray-900/10">
      <div className="glow-spot bg-blue-600/5 dark:bg-blue-600/10 top-1/2 left-1/4" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Reviews"
          title="Client Recommendations"
          subtitle="Feedback from product managers, directors, and start-up founders I have worked with."
          center
        />

        <div className="relative mt-8 min-h-[360px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="w-full"
            >
              <GlassCard className="p-8 md:p-12 border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-gray-950/20 backdrop-blur-xl relative flex flex-col items-center">
                {/* Quote Icon */}
                <Quote className="absolute top-6 right-8 w-12 h-12 text-sky-500/10 dark:text-sky-500/5 pointer-events-none" />

                <div className="flex flex-col items-center text-center max-w-2xl">
                  {/* Client Image */}
                  {current.clientImage && (
                    <Image
                      src={current.clientImage}
                      alt={current.clientName}
                      width={80}
                      height={80}
                      className="rounded-full object-cover border-2 border-sky-500 mb-4 shadow-lg"
                    />
                  )}

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: current.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-base md:text-lg text-slate-700 dark:text-slate-200 italic mb-6 leading-relaxed font-medium">
                    "{current.reviewText}"
                  </p>

                  {/* Author Name */}
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                    {current.clientName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold uppercase tracking-wider">
                    {current.role}
                  </p>

                  {/* Dynamic related project & decision fields */}
                  {(current.project || current.whyChoseMe) && (
                    <div className="mt-6 pt-5 border-t border-slate-200 dark:border-white/5 w-full text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {current.project && (
                        <div className="p-3.5 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                          <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block mb-1">Related Project</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{current.project}</span>
                        </div>
                      )}
                      {current.whyChoseMe && (
                        <div className="p-3.5 rounded-xl bg-slate-100/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                          <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block mb-1">Why They Chose Me</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{current.whyChoseMe}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-center items-center gap-6 mt-8">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors focus:outline-none"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Slider Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > activeIndex ? 1 : -1);
                    setActiveIndex(idx);
                  }}
                  className={`h-2 transition-all duration-300 ${
                    idx === activeIndex ? 'w-6 bg-sky-500' : 'w-2 bg-slate-300 dark:bg-white/20'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors focus:outline-none"
              aria-label="Next review"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Testimonials;
