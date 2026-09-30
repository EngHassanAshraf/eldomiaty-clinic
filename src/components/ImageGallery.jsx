'use client';

import { useState } from 'react';
import Image from 'next/image';

const images = [
    { id: 2, src: '/images/album/g2.jpeg', alt: 'During Operation' },
    { id: 3, src: '/images/album/g3.jpeg', alt: 'Operation Successed' },
    { id: 1, src: '/images/album/g1.jpeg', alt: 'First Visit with Dr. Mohamed' },
    { id: 4, src: '/images/album/g4.jpeg', alt: 'Dr. Mohamed take care of a patient' },
    { id: 5, src: '/images/album/g5.jpeg', alt: 'Family Group Photo With Dr. Mohamed' },
    { id: 6, src: '/images/album/g6.jpeg', alt: 'Dr. Mohamed Talk' },
    { id: 7, src: '/images/album/g7.jpeg', alt: 'Doctors TV program on ElNahar Channel' },
];

export default function ImageGallery() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const activeImage = images[currentIndex];

    const nextImage = () => {
        setCurrentIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    return (
        <div className="flex w-full flex-col gap-3 sm:gap-4">

            {/* Main Image */}
            <div
                className="
                    relative
                    w-full
                    aspect-[4/3]
                    sm:aspect-[16/10]
                    lg:aspect-[16/9]
                    overflow-hidden
                    rounded-2xl
                    bg-gray-100
                    shadow-md
                    group
                "
            >
                <Image
                    src={activeImage.src}
                    alt={activeImage.alt}
                    fill
                    priority={currentIndex === 0}
                    sizes="
                        (max-width: 640px) 100vw,
                        (max-width: 1024px) 90vw,
                        900px
                    "
                    className="object-contain transition-opacity duration-300"
                />

                {/* Previous */}
                <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous image"
                    className="
                        absolute left-2 sm:left-4
                        top-1/2
                        -translate-y-1/2
                        z-10
                        rounded-full
                        bg-white/85
                        p-2 sm:p-2.5
                        text-gray-800
                        shadow-lg
                        transition
                        hover:bg-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-emerald-500
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 19.5L8.25 12l7.5-7.5"
                        />
                    </svg>
                </button>

                {/* Next */}
                <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next image"
                    className="
                        absolute right-2 sm:right-4
                        top-1/2
                        -translate-y-1/2
                        z-10
                        rounded-full
                        bg-white/85
                        p-2 sm:p-2.5
                        text-gray-800
                        shadow-lg
                        transition
                        hover:bg-white
                        focus:outline-none
                        focus:ring-2
                        focus:ring-emerald-500
                    "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="h-5 w-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 4.5l7.5 7.5-7.5 7.5"
                        />
                    </svg>
                </button>
            </div>

            {/* Thumbnails */}
            <div
                className="
                    flex
                    w-full
                    gap-2 sm:gap-3
                    overflow-x-auto
                    px-1
                    py-2
                    scrollbar-thin
                    scrollbar-thumb-gray-300
                    snap-x
                    snap-mandatory
                    lg:justify-center
                "
            >
                {images.map((img, index) => (
                    <button
                        key={img.id}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`View image ${index + 1}`}
                        aria-current={currentIndex === index}
                        className={`
                            relative
                            h-14 w-20
                            sm:h-16 sm:w-24
                            shrink-0
                            snap-start
                            overflow-hidden
                            rounded-lg sm:rounded-xl
                            border-2
                            transition-all
                            duration-200
                            ${currentIndex === index
                                ? 'scale-105 border-emerald-500 shadow-md'
                                : 'border-transparent opacity-60 hover:opacity-100'
                            }
                        `}
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