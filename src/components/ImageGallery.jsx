'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ImageGallery() {
    const images = [
        { id: 1, src: '/images/g1.jpeg', alt: 'First Visit' },
        { id: 2, src: '/images/g2.jpeg', alt: 'During Operation' },
        { id: 3, src: '/images/g3.jpeg', alt: 'Operation Successed ' },
        { id: 4, src: '/images/g4.jpeg', alt: '' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const activeImage = images[currentIndex];

    const nextImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full">

            <div className="relative w-full h-[450px] rounded-2xl overflow-hidden shadow-md bg-gray-100 group">

                <Image
                    src={activeImage.src}
                    alt={activeImage.alt}
                    fill
                    priority
                    className="object-cover transition-opacity duration-300"
                />

                <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                    aria-label="Next image"
                >
                    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>

                <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 z-10"
                    aria-label="Previous image"
                >
                    <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

            </div>

            <div className="flex gap-3 overflow-x-auto py-2 px-1 justify-start lg:justify-center scrollbar-thin scrollbar-thumb-gray-300">
                {images.map((img, index) => (
                    <button
                        key={img.id}
                        onClick={() => setCurrentIndex(index)}
                        className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all duration-200 ${currentIndex === index
                                ? 'border-emerald-500 scale-105 shadow-md'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            sizes="96px"
                            className="object-cover"
                        />
                    </button>
                ))}
            </div>

        </div>
    );
}
