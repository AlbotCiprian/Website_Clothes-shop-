'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface GalleryProps {
  images: string[];
  name: string;
  video?: string | null;
}

export function Gallery({ images, name, video }: GalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const media = video ? [video, ...images] : images;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-slate-200 bg-slate-100">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            {video && activeIndex === 0 ? (
              <video
                src={video}
                className="h-full w-full object-cover"
                controls
                playsInline
                poster={images[0]}
              />
            ) : (
              <Image
                src={media[activeIndex] ?? '/placeholder.svg'}
                alt={`${name} image ${activeIndex + 1}`}
                fill
                className="object-cover"
                priority={activeIndex === 0}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
        {media.map((asset, index) => (
          <button
            key={asset + index}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`relative aspect-square overflow-hidden rounded-xl border ${
              activeIndex === index ? 'border-brand ring-2 ring-brand/40' : 'border-transparent'
            }`}
            aria-label={`View media ${index + 1}`}
          >
            {video && index === 0 ? (
              <div className="flex h-full w-full items-center justify-center bg-black text-white">
                <span className="text-xs font-semibold uppercase">Video</span>
              </div>
            ) : (
              <Image src={asset ?? '/placeholder.svg'} alt={`${name} thumbnail ${index + 1}`} fill className="object-cover" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
