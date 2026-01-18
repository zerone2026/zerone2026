'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, Calendar, Award, Users, ArrowRight, MapPin, Code, Gamepad2, Music, PartyPopper, X, CheckCircle2, Crown } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(splashTimer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-black via-gray-900 to-black">
      <AnimatePresence>
        {showSplash && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-center"
            >
              <div className="relative">
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mb-4"
                >
                  <img
                    src="/zerone-logo.png"
                    alt="Zerone Logo"
                    className="w-24 h-24 mx-auto"
                  />
                </motion.div>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent"
                >
                  ZERONE 2026
                </motion.h1>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showSplash && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-grow"
        >
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5"></div>
            <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 py-20 relative z-10">
              <div className="text-center">
                {/* Main Title */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="mb-8"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.03, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-block"
                  >
                    <img
                      src="/zerone-logo.png"
                      alt="Zerone Logo"
                      className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4"
                    />
                  </motion.div>
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent mb-4">
                    ZERONE 2026
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 mb-8">
                    National Level Tech Fest
                  </p>
                </motion.div>

                {/* Glassmorphism Cards */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex flex-wrap justify-center gap-4 md:gap-6 mb-12"
                >
                  <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-xl px-5 md:px-6 py-4 md:py-5 flex items-center gap-3 md:gap-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <Calendar className="w-8 h-8 md:w-10 md:h-10 text-amber-400" />
                    <div className="text-left">
                      <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider">Date</p>
                      <p className="text-lg md:text-xl font-bold text-white">Feb 4 & 5</p>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-xl px-5 md:px-6 py-4 md:py-5 flex items-center gap-3 md:gap-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <Award className="w-8 h-8 md:w-10 md:h-10 text-amber-400" />
                    <div className="text-left">
                      <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider">Prize Pool</p>
                      <p className="text-lg md:text-xl font-bold text-white">₹50,000</p>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-xl px-5 md:px-6 py-4 md:py-5 flex items-center gap-3 md:gap-4 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                    <MapPin className="w-8 h-8 md:w-10 md:h-10 text-amber-400" />
                    <div className="text-left">
                      <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider">Venue</p>
                      <p className="text-base md:text-lg font-bold text-white">MES Ponnani</p>
                    </div>
                  </div>
                </motion.div>

                {/* Organized By Info */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="max-w-4xl mx-auto mb-12 text-center"
                >
                  <p className="text-gray-400 text-sm md:text-base">
                    <span className="text-amber-400 font-medium">Organized By:</span> Department of Computer Science, Innovation and Entrepreneurship Development Centre, MES Ponnani College
                  </p>
                </motion.div>

                {/* Ticket Perks */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="max-w-4xl mx-auto mb-8"
                >
                  <h2 className="text-2xl font-bold text-white mb-6 text-center">Ticket Perks</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Regular Ticket */}
                    <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Regular Ticket</h3>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start gap-2">
                          <X className="w-5 h-5 text-red-400 mt-1" />
                          <span>Food excluded</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="w-5 h-5 text-red-400 mt-1" />
                          <span>No discount on events</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="w-5 h-5 text-red-400 mt-1" />
                          <span>Accommodation excluded</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <X className="w-5 h-5 text-red-400 mt-1" />
                          <span>No access to cultural night</span>
                        </li>
                      </ul>
                    </div>

                    {/* VIP Ticket */}
                    <div className="bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-400/50 rounded-2xl p-6 relative">
                      <div className="absolute top-0 right-0 bg-amber-500 text-black px-3 py-1 rounded-bl-lg font-bold text-sm">
                        VIP
                      </div>
                      <h3 className="text-xl font-bold text-amber-400 mb-4 mt-2">VIP Ticket</h3>
                      <ul className="space-y-3 text-white">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="font-semibold">Food included:</span>
                            <p className="text-sm text-gray-300">Day 01: Lunch, Dinner | Day 02: Breakfast, Lunch</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="font-semibold">Discount on events:</span>
                            <p className="text-sm text-gray-300">₹10 off on registration fee</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="font-semibold">Accommodation included:</span>
                            <p className="text-sm text-gray-300">(not for MES PNI students)</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                          <span>Access to cultural night</span>
                        </li>
                      </ul>
                      <p className="text-sm text-gray-400 mt-4 pt-4 border-t border-amber-500/20">
                        You have to register as regular ticket and upgrade to VIP
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <Link
                    href="/auth/register"
                    className="group bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50"
                  >
                    <Ticket className="w-5 h-5" />
                    Register Now
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    href="/auth/login"
                    className="group bg-white/10 backdrop-blur-lg border border-amber-500/30 hover:bg-white/20 text-amber-300 font-bold px-6 md:px-8 py-3 md:py-4 rounded-full text-base md:text-lg flex items-center gap-2 transition-all duration-300 hover:scale-105"
                  >
                    Login
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Featured Section */}
          <section className="py-20 relative">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 md:mb-16"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Featured
                </h2>
                <p className="text-lg md:text-xl text-gray-400">Experience best of Zerone 2026</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
                {[
                  {
                    icon: <Code className="w-8 h-8" />,
                    title: "Tech Events",
                    description: "Challenge your skills through cutting-edge tech competitions.",
                  },
                  {
                    icon: <Gamepad2 className="w-8 h-8" />,
                    title: "Games",
                    description: "Unleash your game spirit and compete to win.",
                  },
                  {
                    icon: <PartyPopper className="w-8 h-8" />,
                    title: "Cultural Night",
                    description: "Experience culture, colors, and captivating performances.",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-xl p-6 md:p-8 hover:bg-white/10 transition-all duration-300 cursor-pointer h-full flex flex-col"
                  >
                    <div className="text-amber-400 mb-4">{feature.icon}</div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 text-base md:text-lg">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10"></div>
            <div className="container mx-auto px-4 relative z-10">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="max-w-4xl mx-auto text-center bg-white/5 backdrop-blur-lg border border-amber-500/20 rounded-xl p-8 md:p-12"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Join Zerone 2026?</h2>
                <p className="text-lg md:text-xl text-gray-400 mb-8">
                  Register now and get your golden ticket. Upgrade to VIP for exclusive perks!
                </p>
                <Link
                  href="/auth/register"
                  className="inline-block bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-bold px-10 py-4 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/50"
                >
                  Register Now - It's Free!
                </Link>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-black/50 backdrop-blur-lg border-t border-amber-500/20 py-8 mt-auto">
            <div className="container mx-auto px-4 text-center">
              <p className="text-gray-400 text-sm">
                Developed by Murshida P - murshidaprml@gmail.com | MES Ponnani College
              </p>
            </div>
          </footer>
        </motion.main>
      )}
    </div>
  );
}
