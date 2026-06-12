'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const ITEMS = [
  {
    href: '/programs',
    label: 'Programs',
    description: 'Browse and switch training programs',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: '/timer',
    label: 'Timer',
    description: 'Stopwatch and interval timer',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2 2" />
        <path d="M9.5 2.5h5" />
        <path d="M12 2.5v2" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Profile',
    description: 'Account details and settings',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export function NavMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:border-gray-300 active:scale-95 transition-all shadow-sm"
      >
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="2" y1="4" x2="14" y2="4" />
          <line x1="2" y1="8" x2="14" y2="8" />
          <line x1="2" y1="12" x2="14" y2="12" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />

            {/* Bottom sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 rounded-t-3xl shadow-2xl pb-safe"
            >
              {/* Drag handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full bg-gray-300" />
              </div>

              <div className="px-4 pt-2 pb-6 space-y-2">
                {ITEMS.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-green-50 hover:border-green-200 active:bg-green-100 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-gray-900 font-bold text-base">{item.label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{item.description}</p>
                    </div>
                    <svg className="ml-auto text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
