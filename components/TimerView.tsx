'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

export default function TimerView() {
  const { language } = useGameStore();
  const [selectedTime, setSelectedTime] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const translations = {
    en: {
      title: 'Timer',
      start: 'Start',
      pause: 'Pause',
      resume: 'Resume',
      restart: 'Restart',
      selectTime: 'Select Time',
      timeUp: "Time's Up!",
    },
    tr: {
      title: 'Zamanlayıcı',
      start: 'Başlat',
      pause: 'Duraklat',
      resume: 'Devam Et',
      restart: 'Yeniden Başlat',
      selectTime: 'Süre Seç',
      timeUp: 'Süre Doldu!',
    },
  };

  const t = translations[language];

  const timeOptions = [30, 45, 60, 90];

  useEffect(() => {
    if (isRunning && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, timeLeft]);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleRestart = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(selectedTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const percentage = (timeLeft / selectedTime) * 100;

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-3xl font-bold text-white mb-8 neon-text-purple">{t.title}</h2>

      {/* Time Selection */}
      {!isRunning && (
        <div className="mb-8">
          <p className="text-white/80 mb-4 text-center">{t.selectTime}</p>
          <div className="flex gap-3">
            {timeOptions.map((time) => (
              <motion.button
                key={time}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedTime(time);
                  setTimeLeft(time);
                }}
                className={`px-6 py-3 rounded-lg font-bold transition-all ${
                  selectedTime === time
                    ? 'bg-gradient-to-r from-neon-blue via-neon-orange to-neon-purple text-white neon-glow-purple'
                    : 'bg-white/20 text-white border-2 border-neon-purple/50'
                }`}
              >
                {time}s
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Circular Timer */}
      <div className="relative mb-8">
        <svg className="w-64 h-64 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="128"
            cy="128"
            r="120"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 120}`}
            initial={{ strokeDashoffset: 0 }}
            animate={{
              strokeDashoffset: 2 * Math.PI * 120 * (1 - percentage / 100),
            }}
            transition={{ duration: 1, ease: 'linear' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A90E2" />
              <stop offset="50%" stopColor="#FF8C42" />
              <stop offset="100%" stopColor="#9B59B6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.p
            key={timeLeft}
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            className="text-5xl font-bold text-white"
          >
            {formatTime(timeLeft)}
          </motion.p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        {!isRunning ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="px-8 py-3 bg-gradient-to-r from-neon-blue via-neon-orange to-neon-purple text-white font-bold rounded-lg shadow-lg neon-glow-purple"
          >
            {t.start}
          </motion.button>
        ) : isPaused ? (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleResume}
              className="px-8 py-3 bg-gradient-to-r from-neon-blue via-neon-orange to-neon-purple text-white font-bold rounded-lg shadow-lg neon-glow-purple"
            >
              {t.resume}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="px-8 py-3 bg-white/20 border-2 border-neon-purple/50 text-white font-bold rounded-lg hover:bg-white/30"
            >
              {t.restart}
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePause}
              className="px-8 py-3 bg-white/20 border-2 border-neon-purple/50 text-white font-bold rounded-lg hover:bg-white/30"
            >
              {t.pause}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRestart}
              className="px-8 py-3 bg-white/20 border-2 border-neon-purple/50 text-white font-bold rounded-lg hover:bg-white/30"
            >
              {t.restart}
            </motion.button>
          </>
        )}
      </div>

      {timeLeft === 0 && (
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 text-2xl font-bold text-neon-orange neon-text-orange"
        >
          {t.timeUp}
        </motion.p>
      )}
    </div>
  );
}




