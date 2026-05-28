'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { SectionHeader } from '../components/SectionHeader';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/Button';
import api from '../services/api';

interface ContactFormInputs {
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
}

export const Contact: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormInputs>({
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
      phone: '',
    }
  });

  const onSubmit = async (data: ContactFormInputs) => {
    try {
      setSubmitting(true);
      const res = await api.post('/messages', data);
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Message sent successfully!');
        reset();
      } else {
        toast.error(res.data.message || 'Could not send message.');
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Something went wrong, please try again.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const contactDetails = [
    { icon: Mail, label: 'Email', value: 'masud.dev01@gmail.com', href: 'mailto:masud.dev01@gmail.com', color: 'text-blue-500' },
    { icon: Phone, label: 'Phone', value: '+880 18770-80660', href: 'tel:+8801877080660', color: 'text-emerald-500' },
    { icon: MapPin, label: 'Location', value: 'Chirirbandar, Dinajpur, Bangladesh', href: '#', color: 'text-orange-500' },
  ];

  return (
    <section id="contact" className="py-20 relative overflow-hidden bg-slate-100/30 dark:bg-gray-900/10">
      <div className="glow-spot bg-blue-600/5 dark:bg-blue-600/10 top-1/4 left-1/4" />
      <div className="glow-spot bg-emerald-600/5 dark:bg-emerald-600/10 bottom-1/4 right-1/4 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Get in Touch"
          title="Start A Collaboration"
          subtitle="Submit an inquiry below, and I will get back to you within 24 business hours."
          center
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-12 max-w-6xl mx-auto">
          {/* Info Side (Left) */}
          <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
            <GlassCard className="p-8 border-slate-200 dark:border-white/5 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Contact Information
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                  Feel free to reach out directly via phone or email for urgent consulting engagements.
                </p>

                <div className="flex flex-col gap-6">
                  {contactDetails.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={idx}
                        href={item.href}
                        className="flex items-center gap-4 group hover:bg-slate-100/50 dark:hover:bg-white/5 p-3 rounded-xl transition-all"
                      >
                        <div className={`p-3 rounded-xl bg-slate-200/50 dark:bg-white/5 border border-slate-300/50 dark:border-white/10 ${item.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                            {item.label}
                          </span>
                          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-sky-500 transition-colors">
                            {item.value}
                          </span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-200 dark:border-white/5 text-xs text-slate-500 dark:text-slate-400">
                Praise my design or request API source reviews. I am available for remote operations worldwide.
              </div>
            </GlassCard>
          </div>

          {/* Form Side (Right) */}
          <div className="lg:col-span-7">
            <GlassCard className="p-8 border-slate-200/50 dark:border-white/5 h-full bg-white/50 dark:bg-gray-950/20 backdrop-blur-md">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter Your Name"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all text-xs"
                    />
                    {errors.name && (
                      <span className="text-[10px] font-semibold text-red-500 mt-1">{errors.name.message}</span>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter Your E-mail"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                          message: 'Please enter a valid email address',
                        },
                      })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all text-xs"
                    />
                    {errors.email && (
                      <span className="text-[10px] font-semibold text-red-500 mt-1">{errors.email.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Phone Input */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Phone Number (Optional)
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="e.g. +880 1700-000000"
                      {...register('phone')}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all text-xs"
                    />
                  </div>

                  {/* Subject Input */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="subject" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="e.g. SaaS Consultation Inquiry"
                      {...register('subject', { required: 'Subject is required' })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all text-xs"
                    />
                    {errors.subject && (
                      <span className="text-[10px] font-semibold text-red-500 mt-1">{errors.subject.message}</span>
                    )}
                  </div>
                </div>

                {/* Message Input */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Describe your project criteria in detail..."
                    {...register('message', { required: 'Message is required' })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all text-xs resize-none"
                  />
                  {errors.message && (
                    <span className="text-[10px] font-semibold text-red-500 mt-1">{errors.message.message}</span>
                  )}
                </div>

                {/* Submit Button */}
                <Button type="submit" disabled={submitting} className="w-full mt-2 gap-2">
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Inquiry
                    </>
                  )}
                </Button>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
