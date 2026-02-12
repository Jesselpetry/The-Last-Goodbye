"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import ReactConfetti from "react-confetti";
import { Mail, MailOpen, PenTool, Music, ChevronLeft, ChevronRight } from "lucide-react";

interface LetterProps {
  name: string;
  content: string;
  imageUrls?: string[] | null;
  spotifyUrl?: string | null;
  // Backward compatibility
  imageUrl?: string | null;
}

export default function Letter({
  name,
  content,
  imageUrls,
  spotifyUrl,
  imageUrl,
}: LetterProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  // Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Merge legacy imageUrl into imageUrls if needed
  const images = imageUrls && imageUrls.length > 0
    ? imageUrls
    : imageUrl ? [imageUrl] : [];

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", onSelect);
    onSelect(); // Initial check
  }, [emblaApi]);

  const handleOpen = () => {
    setIsOpened(true);
    setShowConfetti(true);
    // Stop confetti after 5 seconds
    setTimeout(() => setShowConfetti(false), 5000);
  };

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 overflow-hidden relative">
      {showConfetti && (
        <ReactConfetti
          recycle={false}
          numberOfPieces={500}
          gravity={0.15}
        />
      )}

      <AnimatePresence mode="wait">
        {/* --- STATE 1: Envelope (Closed) --- */}
        {!isOpened ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: 100,
              scale: 0.8,
              transition: { duration: 0.5 },
            }}
            whileHover={{ scale: 1.05, rotate: -1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpen}
            className="cursor-pointer z-10 relative group"
          >
            <div className="w-[320px] h-[220px] bg-[#F2E8C9] border-2 border-[#E6D5A7] rounded-lg shadow-xl relative flex flex-col items-center justify-center overflow-hidden">
              {/* Envelope Flap Effect */}
              <div className="absolute top-0 left-0 w-full h-0 border-l-[160px] border-r-[160px] border-t-[110px] border-l-transparent border-r-transparent border-t-[#EBDCB5] drop-shadow-sm origin-top z-20 group-hover:rotate-x-12 transition-transform"></div>

              {/* Icon */}
              <div className="absolute top-24 z-30 bg-red-400 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm rotate-12">
                <Mail className="w-6 h-6" />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-12">
              <p className="font-mali text-black text-lg animate-pulse flex items-center gap-2">
                <MailOpen className="w-5 h-5" /> แตะเพื่อเปิดจดหมายถึง
              </p>
              <p className="font-mali text-gray-600 text-lg animate-pulse">
                {name}
              </p>
            </div>
          </motion.div>
        ) : (
          /* --- STATE 2: Content (Opened) --- */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl mx-auto w-full z-10 relative pb-20"
          >
            {/* Header */}
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="text-center mb-8 mt-8"
            >
              <h1 className="text-3xl md:text-4xl font-mali text-gray-800 mb-2 font-bold">
                ถึง {name}
              </h1>
              <div className="w-16 h-0.5 bg-gray-300 mx-auto" />
            </motion.div>

            {/* Image Carousel */}
            {images.length > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -5 }}
                animate={{ scale: 1, rotate: 2 }}
                transition={{
                  delay: 0.7,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="mb-8 relative max-w-sm mx-auto"
              >
                <div className="overflow-hidden rounded-xl shadow-lg border-[6px] border-white bg-gray-100 aspect-[4/3] sm:aspect-square" ref={emblaRef}>
                  <div className="flex h-full">
                    {images.map((img, index) => (
                      <div className="flex-[0_0_100%] min-w-0 relative" key={index}>
                        <Image
                          src={img}
                          alt={`Memory ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 384px"
                          priority={index === 0}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md text-gray-800 hover:bg-white disabled:opacity-50 transition-all"
                      onClick={scrollPrev}
                      disabled={!canScrollPrev}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-md text-gray-800 hover:bg-white disabled:opacity-50 transition-all"
                      onClick={scrollNext}
                      disabled={!canScrollNext}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </motion.div>
            )}

            {/* Letter Content */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6, ease: "easeOut" }}
              className="bg-white/90 backdrop-blur-sm rounded-xl p-6 md:p-10 shadow-md border border-gray-50 relative"
            >
              <div
                className="font-mali text-lg md:text-xl leading-loose text-gray-700 whitespace-pre-wrap"
                style={{ lineHeight: "2.2" }}
              >
                {content}
              </div>

              {/* Signature */}
              <div className="mt-16 pt-6 border-t border-gray-100 flex flex-col items-end text-right">
                <div className="flex items-center gap-2 mb-1">
                  <PenTool className="w-4 h-4 text-gray-400" />
                  <p className="font-mali text-xl font-bold text-gray-800">
                    จาก เจส
                  </p>
                </div>
                <p className="font-mali text-sm text-gray-400">
                  (ฉัททัณฑ์ เพททริ)
                </p>
              </div>
            </motion.div>

            {/* Spotify Embed */}
            {spotifyUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-8 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-gray-50 flex items-center justify-center"
              >
                <div className="w-full flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-green-600 mb-2">
                    <Music className="w-5 h-5" />
                    <span className="font-mali font-bold text-sm">Song for you</span>
                  </div>
                  <iframe
                    style={{ borderRadius: "12px" }}
                    src={spotifyUrl.replace("open.spotify.com", "open.spotify.com/embed")}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </div>
              </motion.div>
            )}

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-center mt-12 space-y-2 opacity-80"
            >
              <p className="font-mali text-gray-500 text-sm">
                จดหมายฉบับนี้ถูกเขียนขึ้นด้วยความตั้งใจ
              </p>
              <p className="font-mali text-gray-500 text-sm">
                แด่มิตรภาพตลอด 3 ปีที่ผ่านมา 🤍
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
