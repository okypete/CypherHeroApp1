'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function SplashScreen() {
  const [showLogo, setShowLogo] = useState(true);
  const [showGradient, setShowGradient] = useState(false);

  useEffect(() => {
    // Logo animation for 3 seconds
    const logoTimer = setTimeout(() => {
      setShowLogo(false);
      // Start gradient transition
      setTimeout(() => {
        setShowGradient(true);
      }, 800);
    }, 3000);

    return () => clearTimeout(logoTimer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-dark-bg">
      {/* Neon background effects */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            x: ['0%', '30%', '0%'],
            y: ['0%', '-20%', '0%'],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: ['0%', '-25%', '0%'],
            y: ['0%', '25%', '0%'],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Logo on dark background */}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-dark-bg flex items-center justify-center"
          >
            {/* Logo animation with neon glow */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.8, 1.1, 1],
                opacity: 1,
              }}
              transition={{
                duration: 2,
                ease: "easeOut",
              }}
              className="relative"
            >
              {/* Logo image with neon glow */}
              <motion.div
                animate={{
                  filter: [
                    'drop-shadow(0 0 20px rgba(0, 255, 255, 0.5)) drop-shadow(0 0 40px rgba(147, 51, 234, 0.3))',
                    'drop-shadow(0 0 30px rgba(0, 255, 255, 0.8)) drop-shadow(0 0 60px rgba(147, 51, 234, 0.5)) drop-shadow(0 0 80px rgba(255, 0, 255, 0.3))',
                    'drop-shadow(0 0 20px rgba(0, 255, 255, 0.5)) drop-shadow(0 0 40px rgba(147, 51, 234, 0.3))',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="relative w-[600px] h-[300px] md:w-[800px] md:h-[400px]"
              >
                <Image
                  src="/cypher-hero-logo.png"
                  alt="Cypher Hero"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ghibli-style gradient background transition */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showGradient ? 1 : 0 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 gradient-bg"
      >
        {/* Additional soft effects */}
        <motion.div
          animate={{
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 30%, rgba(176, 224, 230, 0.3) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(144, 238, 144, 0.3) 0%, transparent 50%)',
          }}
        />
      </motion.div>
    </div>
  );
}
