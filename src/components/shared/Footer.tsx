'use client';

import Link from 'next/link';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';
import { FaXTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa6'; // অথবা lucide-react / svg ব্যবহার করতে পারেন

export default function Footer() {
  return (
    <footer className="bg-[#121814] border-t border-gray-800/80 text-white pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* মূল ফুটার গ্রিড (৩ কলাম) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pb-12 border-b border-gray-800/60">
          
          {/* ১. ব্র্যান্ড ইনফো ও বিবরণ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold font-serif tracking-wide">
                BookNook
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              A small neighbourhood library on the web. Share the books on your shelf and borrow the ones you have been meaning to read.
            </p>
          </div>

          {/* ২. কন্টাক্ট ইনফরমেশন */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="mailto:hello@booknook.app" className="hover:text-white transition">
                  hello@booknook.app
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a href="tel:+8801867070070" className="hover:text-white transition">
                  +880 1867070070
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Joydebpur, Gazipur, Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>

          {/* ৩. সোশ্যাল মিডিয়া / Follow us */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-emerald-400">
              Follow us
            </h3>
            <p className="text-gray-400 text-sm">
              Connect with our community online for latest updates.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#18221c] border border-gray-800 flex items-center justify-center text-gray-300 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition"
                aria-label="Twitter"
              >
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#18221c] border border-gray-800 flex items-center justify-center text-gray-300 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition"
                aria-label="Facebook"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#18221c] border border-gray-800 flex items-center justify-center text-gray-300 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 transition"
                aria-label="Instagram"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* নিচের কপিরাইট সেকশন */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© 2026 BookNook. All rights reserved.</p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-gray-300 transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}