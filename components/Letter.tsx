"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import ReactConfetti from "react-confetti";
import { Mail, MailOpen, Volume2, VolumeX, Music, Send, User, MessageSquare, Check } from "lucide-react";
import { createReply, getReplies } from "@/app/actions/replies";
import { Reply } from "@/lib/types";

interface LetterProps {
  friendId?: string; // Optional for preview, required for replies
  name: string;
  content: string;
  imageUrls?: string[] | null;
  spotifyUrl?: string | null;
  bgmUrl?: string | null;
  imageUrl?: string | null;
  timestamp?: string;
  isPreview?: boolean;
}

export default function Letter({
  friendId,
  name,
  content,
  imageUrls,
  spotifyUrl,
  bgmUrl,
  imageUrl,
  timestamp,
  isPreview = false,
}: LetterProps) {
  // If isPreview, start opened. Otherwise closed.
  const [isOpened, setIsOpened] = useState(isPreview);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // --- AUDIO SYSTEM STATES ---
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false); // Default unmuted if user interacts, but browsers block it.
  const [hasInteracted, setHasInteracted] = useState(isPreview); // In preview, we assume interaction/skip

  // --- REPLY SYSTEM STATES ---
  const [replyContent, setReplyContent] = useState("");
  const [senderName, setSenderName] = useState("");
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const springConfig = {
    type: "spring" as const,
    stiffness: 100,
    damping: 20,
    mass: 0.8
  };

  const smoothSpringConfig = {
    type: "spring" as const,
    stiffness: 80,
    damping: 25,
    mass: 1
  };

  const rawImages =
    imageUrls && imageUrls.length > 0
      ? imageUrls
      : imageUrl
      ? [imageUrl]
      : [];

  const [displayImages, setDisplayImages] = useState(() =>
    rawImages.map((url, i) => ({ id: i, url }))
  );

  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cycle images
  useEffect(() => {
    if (!isOpened || displayImages.length <= 1) return;

    const interval = setInterval(() => {
      if (isMobile) {
        setCurrentMobileIndex((prev) => (prev + 1) % displayImages.length);
      } else {
        setDisplayImages((prev) => {
          const newArr = [...prev];
          const last = newArr.pop();
          if (last) newArr.unshift(last);
          return newArr;
        });
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isOpened, displayImages.length, isMobile]);

  // Load replies
  useEffect(() => {
    if (friendId && !isPreview) {
      getReplies(friendId).then(setReplies);
    }
  }, [friendId, isPreview]);

  // --- AUDIO EFFECT ---
  useEffect(() => {
    if (bgmUrl && audioRef.current) {
        audioRef.current.volume = 0.5;
        if (isOpened && !isMuted && !isPreview) {
            audioRef.current.play().catch(() => {
                // Autoplay blocked
                setIsMuted(true);
            });
        }
    }
  }, [bgmUrl, isOpened, isMuted, isPreview]);

  // --- HANDLE OPEN ---
  const handleOpen = () => {
    setIsOpened(true);
    setShowConfetti(true);
    setHasInteracted(true);
    
    if (audioRef.current && bgmUrl && !isMuted) {
      audioRef.current.play().catch(err => {
          console.log("Audio play prevented:", err);
          setIsMuted(true);
      });
    }

    setTimeout(() => setShowConfetti(false), 6000);
  };

  // --- HANDLE MUTE TOGGLE ---
  const toggleMute = () => {
    if (audioRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      audioRef.current.muted = newMutedState;
      
      if (!newMutedState) {
         audioRef.current.play().catch(e => console.log("Play failed", e));
      }
    }
  };

  // --- HANDLE REPLY ---
  const handleSendReply = async () => {
    if (!replyContent.trim() || !friendId) return;
    setIsSending(true);

    const res = await createReply(friendId, replyContent, senderName || undefined);

    if (res.success) {
        setSendSuccess(true);
        setReplyContent("");
        // Optimistic update
        const newReply: Reply = {
            id: 'temp-' + Date.now(),
            friend_id: friendId,
            content: replyContent,
            sender_name: senderName || null,
            is_read: false,
            created_at: new Date().toISOString()
        };
        setReplies([newReply, ...replies]);

        setTimeout(() => setSendSuccess(false), 3000);
    } else {
        alert("ส่งข้อความไม่สำเร็จ กรุณาลองใหม่");
    }
    setIsSending(false);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("th-TH", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const envelopeVariants = {
    initial: { opacity: 0, y: 50, scale: 0.8, rotateY: -15 },
    animate: { opacity: 1, y: 0, scale: 1, rotateY: 0, transition: { ...springConfig, duration: 0.8 } },
    exit: { opacity: 0, y: -100, scale: 0.6, rotateY: 15, transition: { duration: 0.6, ease: "easeInOut" as const } },
    hover: { scale: 1.08, rotate: -2, y: -5, transition: { type: "spring" as const, stiffness: 400, damping: 10 } },
    tap: { scale: 0.95, rotate: 1, transition: { type: "spring" as const, stiffness: 600, damping: 20 } }
  };

  const contentVariants = {
    initial: { opacity: 0, scale: 0.9, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0, transition: { duration: 1, ease: "easeOut" as const, staggerChildren: 0.2, delayChildren: 0.1 } }
  };

  const childVariants = {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1, transition: smoothSpringConfig }
  };

  const imageVariants = {
    initial: { scale: 0, opacity: 0, y: 50, rotate: 0 },
    animate: { scale: 1, opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 120, damping: 15, mass: 0.8 } },
    hover: { scale: 1.08, y: -12, rotate: 0, zIndex: 50, transition: { type: "spring" as const, stiffness: 300, damping: 20 } }
  };

  const mobileImageVariants = {
    initial: { opacity: 0, x: 120, rotate: 8, scale: 0.9 },
    animate: { opacity: 1, x: 0, rotate: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100, damping: 20, mass: 0.9 } },
    exit: { opacity: 0, x: -120, rotate: -8, scale: 0.9, transition: { type: "spring" as const, stiffness: 120, damping: 25, mass: 0.7 } }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 overflow-hidden relative ${isPreview ? 'bg-transparent' : ''}`}>
      
      {/* --- HIDDEN AUDIO ELEMENT --- */}
      {bgmUrl && !isPreview && (
        <audio ref={audioRef} src={bgmUrl} loop preload="auto" />
      )}

      {/* --- MUTE/UNMUTE BUTTON --- */}
      <AnimatePresence>
        {isOpened && bgmUrl && !isPreview && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            onClick={toggleMute}
            className="fixed top-6 right-6 z-50 bg-white/50 hover:bg-white/80 backdrop-blur-md p-3 rounded-full shadow-md text-gray-700 transition-all border border-gray-100"
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </motion.button>
        )}
      </AnimatePresence>

      {showConfetti && !isPreview && (
        <ReactConfetti
          recycle={false}
          numberOfPieces={300}
          gravity={0.12}
          wind={0.01}
          colors={['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']}
        />
      )}

      <AnimatePresence mode="wait">
        {!isOpened ? (
          <motion.div
            key="envelope"
            variants={envelopeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            whileHover="hover"
            whileTap="tap"
            onClick={handleOpen}
            className="cursor-pointer z-10 relative group perspective-1000"
          >
            <div className="w-[320px] h-[220px] bg-gradient-to-br from-[#F2E8C9] to-[#EBDCB5] border-2 border-[#E6D5A7] rounded-lg shadow-md relative flex flex-col items-center justify-center overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 w-full h-0 border-l-[160px] border-r-[160px] border-t-[110px] border-l-transparent border-r-transparent border-t-[#D4C4A0] drop-shadow-lg origin-top z-20"
                whileHover={{ rotateX: 15, transition: { type: "spring", stiffness: 200, damping: 15 } }}
              />
              <motion.div 
                className="absolute top-24 z-30 bg-gradient-to-br from-red-400 to-red-600 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
                animate={{ rotate: [10, 15, 10] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.1, rotate: 0, transition: { type: "spring", stiffness: 300, damping: 15 } }}
              >
                <Mail className="w-7 h-7" />
              </motion.div>
              <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-transparent via-white to-transparent" />
            </div>
            
            <motion.div 
              className="flex flex-col items-center justify-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, ...smoothSpringConfig }}
            >
              <motion.p 
                className="font-mali text-black text-lg flex items-center gap-2"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <MailOpen className="w-5 h-5" /> แตะเพื่อเปิดจดหมายถึง
              </motion.p>
              <motion.p 
                className="font-mali text-gray-600 text-lg font-semibold"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              >
                {name}
              </motion.p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={contentVariants}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto w-full z-10 relative pb-20 pt-10 md:pt-4"
          >
            {/* Header */}
            <motion.div variants={childVariants} className="text-center mb-4 mt-4">
              <motion.h1 
                className="text-3xl md:text-4xl font-mali text-gray-800 mb-4 font-bold"
                initial={{ letterSpacing: "0.2em", opacity: 0 }}
                animate={{ letterSpacing: "0.05em", opacity: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                ถึง {name}
              </motion.h1>
              <motion.div 
                className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              />
            </motion.div>

            {/* Image Display Section */}
            {displayImages.length > 0 && (
              <motion.div variants={childVariants} className="mb-4 flex justify-center items-center relative w-full h-[400px] md:h-[450px]">
                {isMobile ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={displayImages[currentMobileIndex].id}
                      variants={mobileImageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="absolute z-10"
                    >
                      <div className="bg-white p-3 pb-12 shadow-md rounded-md w-[260px] sm:w-[280px] border border-gray-100">
                        <div className="overflow-hidden bg-gray-50 aspect-[4/4] relative w-full border border-gray-200 rounded">
                          <Image
                            src={displayImages[currentMobileIndex].url}
                            alt={`Memory ${currentMobileIndex + 1}`}
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-105"
                            sizes="(max-width: 640px) 260px, 280px"
                            priority
                          />
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="flex justify-center items-end gap-6 lg:gap-8 w-full max-w-5xl mx-auto px-4">
                    <AnimatePresence>
                      {displayImages.slice(0, 3).map((item, index) => {
                        let position = "";
                        let size = "";
                        let rotation = 0;
                        
                        if (displayImages.length > 1) {
                          if (index === 0) { position = "mt-8"; size = "w-48 lg:w-52"; rotation = -12; } 
                          else if (index === 1) { position = "mb-0"; size = "w-56 lg:w-64"; rotation = 0; } 
                          else { position = "mt-8"; size = "w-48 lg:w-52"; rotation = 12; }
                        } else {
                          position = "mb-0"; size = "w-56 lg:w-64"; rotation = 0;
                        }

                        const zIndex = index === 1 ? 30 : 20;

                        return (
                          <motion.div
                            layout
                            key={item.id}
                            variants={imageVariants}
                            initial="initial"
                            animate={{ ...imageVariants.animate, rotate: rotation }}
                            whileHover={{ scale: 1.08, y: -12, rotate: 0, zIndex: 50, transition: { type: "spring", stiffness: 300, damping: 20 } }}
                            transition={{ layout: { type: "spring", stiffness: 200, damping: 20, mass: 0.8 } }}
                            className={`relative cursor-pointer ${position}`}
                            style={{ zIndex }}
                          >
                            <div className={`bg-white p-3 pb-12 shadow-md rounded-md ${size} border border-gray-100 transition-all duration-300`}>
                              <div className="overflow-hidden bg-gray-50 aspect-[4/4] relative w-full border border-gray-200 rounded">
                                <Image
                                  src={item.url}
                                  alt={`Memory ${item.id + 1}`}
                                  fill
                                  className="object-cover transition-transform duration-500 hover:scale-110"
                                  sizes="(max-width: 1024px) 224px, 256px"
                                  priority={index === 0}
                                />
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    {displayImages.length > 3 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2, ...smoothSpringConfig }}
                        className="absolute bottom-0 right-4 bg-gray-800 text-white text-sm px-3 py-1 rounded-full shadow-lg"
                      >
                        +{displayImages.length - 3} รูป
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Letter Content */}
            <motion.div
              variants={childVariants}
              className="bg-white/95 backdrop-blur-sm rounded-xl p-6 md:p-10 shadow-md border border-gray-100 relative mt-4"
            >
              <motion.div 
                className="font-mali text-lg md:text-xl leading-loose text-gray-700 whitespace-pre-wrap" 
                style={{ lineHeight: "2.2" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.3 }}
              >
                {content}
              </motion.div>

              <motion.div 
                className="mt-12 pt-6 border-t border-gray-200 flex flex-col items-end"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, ...smoothSpringConfig }}
              >
                <motion.div 
                  className="text-right"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, ...smoothSpringConfig }}
                >
                  <p className="font-mali text-xl font-bold text-gray-800">จาก เจส</p>
                  <p className="font-mali text-sm text-gray-500 mb-2">(ฉัททัณฑ์ เพททริ)</p>
                  {timestamp && <p className="font-mali text-xs text-gray-400">เขียนเมื่อ: {formatDate(timestamp)}</p>}
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Spotify Section */}
            {spotifyUrl && (
              <motion.div
                variants={childVariants}
                className="mt-8 bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-md border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, ...smoothSpringConfig }}
              >
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                  <Music className="w-5 h-5 text-gray-500" />
                  <h3 className="font-mali text-lg font-semibold text-gray-700">เพลงนี้ให้ {name}</h3>
                </div>
                
                <motion.div 
                  className="w-full"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.4, ...smoothSpringConfig }}
                >
                  <iframe
                    style={{ borderRadius: "12px" }}
                    src={spotifyUrl.replace("open.spotify.com", "open.spotify.com/embed")}
                    width="100%"
                    height="80"
                    frameBorder="0"
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  ></iframe>
                </motion.div>
              </motion.div>
            )}

            {/* --- REPLY SECTION --- */}
            {/* Show only if friendId is present (Preview mode might pass undefined, but we can still show UI) */}
            <motion.div
              variants={childVariants}
              className="mt-8 bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-md border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, ...smoothSpringConfig }}
            >
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                 <MessageSquare className="w-5 h-5 text-gray-500" />
                 <h3 className="font-mali text-lg font-semibold text-gray-700">เขียนข้อความถึงเจส</h3>
              </div>

              {!sendSuccess ? (
                  <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1 font-mali">ชื่อของคุณ (ไม่บังคับ)</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                                placeholder={`ใช้ชื่อ "${name}"`}
                                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 outline-none font-mali text-sm bg-white/50"
                            />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1 font-mali">ข้อความ</label>
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="เขียนข้อความส่งถึงกัน..."
                            className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-400 outline-none font-mali h-32 bg-white/50 resize-none"
                        />
                      </div>
                      <button
                        onClick={handleSendReply}
                        disabled={isSending || !replyContent.trim()}
                        className="w-full py-3 bg-gray-800 text-white rounded-xl font-mali font-bold hover:bg-gray-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                      >
                         {isSending ? 'กำลังส่ง...' : <><Send className="w-4 h-4" /> ส่งข้อความ</>}
                      </button>
                  </div>
              ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-8 text-green-600 gap-2"
                  >
                     <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                        <Check className="w-6 h-6" />
                     </div>
                     <p className="font-mali font-bold text-lg">ส่งข้อความถึงเจสแล้ว 🤍</p>
                  </motion.div>
              )}

              {/* FEED OF REPLIES */}
              {replies.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                   <h4 className="font-mali font-bold text-gray-600 mb-4 text-sm">ข้อความที่ส่งแล้ว</h4>
                   <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                      {replies.map((reply) => (
                          <div key={reply.id} className="bg-white/60 p-4 rounded-xl border border-gray-100 text-sm">
                              <div className="flex justify-between items-start mb-1">
                                  <span className="font-bold text-gray-700 font-mali">{reply.sender_name || name}</span>
                                  <span className="text-xs text-gray-400 font-mali">{new Date(reply.created_at).toLocaleDateString('th-TH')}</span>
                              </div>
                              <p className="text-gray-600 font-mali whitespace-pre-wrap">{reply.content}</p>
                          </div>
                      ))}
                   </div>
                </div>
              )}
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, ...smoothSpringConfig }}
              className="text-center mt-12 space-y-2"
            >
              <motion.p 
                className="font-mali text-gray-500 text-sm"
                animate={{ opacity: [0.6, 0.8, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                จดหมายฉบับนี้ถูกเขียนขึ้นด้วยความตั้งใจ
              </motion.p>
              <motion.p 
                className="font-mali text-gray-500 text-sm"
                animate={{ opacity: [0.5, 0.7, 0.5] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                แด่มิตรภาพตลอด 3 ปีที่ผ่านมา 🤍
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
