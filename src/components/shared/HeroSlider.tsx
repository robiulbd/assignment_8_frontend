'tsx'
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// স্লাইডারের জন্য কিছু স্যাম্পল লাইব্রেরি/বইয়ের ব্যাকগ্রাউন্ড ইমেজ ও টেক্সট
const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1920&auto=format&fit=crop',
    title: 'Welcome to BookNook Online Library',
    subtitle: 'Discover, borrow, and manage your favorite books seamlessly.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1920&auto=format&fit=crop',
    title: 'Expand Your Reading Horizons',
    subtitle: 'Explore thousands of books from various genres and authors.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=1920&auto=format&fit=crop',
    title: 'Add And Share Your Books',
    subtitle: 'Manage your personal collection and share with others easily.',
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // প্রতি ৩ সেকেন্ড পর পর স্লাইড পরিবর্তন করার জন্য useEffect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 3000); // ৩০০০ মিলি সেকেন্ড = ৩ সেকেন্ড

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[280px] md:h-[320px] overflow-hidden bg-gray-900">
      {/* Background Images with Fade Effect */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center filter brightness-50"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 text-white">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight mb-2 drop-shadow-md">
          {slides[currentSlide].title}
        </h1>
        <p className="text-sm md:text-base text-gray-200 max-w-xl mb-4 drop-shadow">
          {slides[currentSlide].subtitle}
        </p>
        <div className="flex gap-4">
          <Link
            href="/books"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow"
          >
            Browse Books
          </Link>
          <Link
            href="/add-book"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-6 bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
          >
            Add This Book
          </Link>
        </div>
      </div>

      {/* Slide Indicators (Dots) */}
      <div className="absolute bottom-3 left-0 right-0 z-30 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'w-6 bg-primary' : 'w-2 bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}