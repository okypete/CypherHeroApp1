'use client';

import { useGameStore } from '@/store/gameStore';
import { BOARD_SQUARES } from '@/lib/gameData';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface BoardViewProps {
  onSquareLand: (square: string) => void;
}

export default function BoardView({ onSquareLand }: BoardViewProps) {
  const { playerPosition, language } = useGameStore();

  // Calculate positions for squares in a square layout (matching actual board)
  // Board has 24 squares: 6 per side, starting from bottom-right (Start)
  const getSquarePosition = (index: number, totalSquares: number) => {
    const sideLength = totalSquares / 4; // 24 squares = 6 per side
    const squareSize = 8; // percentage offset from edge
    
    // Determine which side of the square (clockwise from Start at bottom-right)
    if (index < sideLength) {
      // Bottom side (right to left) - Start is at index 0, bottom-right
      const progress = index / sideLength;
      const x = 100 - squareSize - (progress * (100 - squareSize * 2));
      const y = 100 - squareSize;
      return { x, y, side: 'bottom', rotation: 0 };
    } else if (index < sideLength * 2) {
      // Left side (bottom to top)
      const progress = (index - sideLength) / sideLength;
      const x = squareSize;
      const y = 100 - squareSize - (progress * (100 - squareSize * 2));
      return { x, y, side: 'left', rotation: 90 };
    } else if (index < sideLength * 3) {
      // Top side (left to right)
      const progress = (index - sideLength * 2) / sideLength;
      const x = squareSize + (progress * (100 - squareSize * 2));
      const y = squareSize;
      return { x, y, side: 'top', rotation: 180 };
    } else {
      // Right side (top to bottom)
      const progress = (index - sideLength * 3) / sideLength;
      const x = 100 - squareSize;
      const y = squareSize + (progress * (100 - squareSize * 2));
      return { x, y, side: 'right', rotation: 270 };
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {language === 'en' ? 'Game Board' : 'Oyun Tahtası'}
        </h2>

        {/* Square Board Representation (matching actual board design) */}
        <div className="relative w-full max-w-2xl mx-auto aspect-square">
          {/* Outer border - thick black border like actual board */}
          <div className="absolute inset-0 border-8 border-black bg-white">
            {/* Board Squares around perimeter */}
            <div className="absolute inset-0">
              {BOARD_SQUARES.map((square, index) => {
                const pos = getSquarePosition(index, BOARD_SQUARES.length);
                const isCurrentPosition = index === playerPosition;
                const isStart = square === 'Start';
                const isCypherGate = square === 'Cypher Gate';
                const isChanceCard = square === 'Chance Card';
                const isTrapCard = square === 'Trap Card';

                // Determine square styling
                let squareClass = 'bg-white text-gray-800 border-2 border-gray-300';
                if (isChanceCard) {
                  squareClass = 'bg-gradient-to-br from-primary-turquoise to-blue-400 text-white border-2 border-primary-turquoise';
                } else if (isTrapCard) {
                  squareClass = 'bg-gradient-to-br from-primary-orange to-red-400 text-white border-2 border-primary-orange';
                } else if (isCypherGate) {
                  squareClass = 'bg-gradient-to-br from-purple-400 to-purple-600 text-white border-2 border-purple-500';
                } else if (isStart) {
                  squareClass = 'bg-gradient-to-br from-green-400 to-green-600 text-white border-2 border-green-500';
                }

                if (isCurrentPosition) {
                  squareClass += ' scale-125 z-10 ring-4 ring-primary-orange';
                }

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="absolute cursor-pointer group"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    onClick={() => onSquareLand(square)}
                  >
                    <div
                      className={`w-16 h-10 md:w-20 md:h-12 rounded flex items-center justify-center text-[10px] md:text-xs font-bold text-center p-1 shadow-lg transition-all hover:scale-110 border-2 ${squareClass}`}
                      style={{
                        transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
                      }}
                    >
                      <div className="flex flex-col items-center transform" style={{ transform: `rotate(${-pos.rotation}deg)` }}>
                        {isStart && (
                          <span className="text-sm mb-0.5">→</span>
                        )}
                        {isCypherGate && (
                          <span className="text-[8px] mb-0.5">🚪</span>
                        )}
                        <span className="leading-tight break-words">{square}</span>
                      </div>
                    </div>
                    {isCurrentPosition && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-primary-orange rounded-full border-2 border-white shadow-lg"
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Center Circle with Logo - Cyberpunk style */}
            <div className="absolute inset-12 md:inset-16 flex items-center justify-center">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)',
                    '0 0 30px rgba(0, 255, 255, 0.7), 0 0 60px rgba(147, 51, 234, 0.5), 0 0 80px rgba(255, 68, 68, 0.3)',
                    '0 0 20px rgba(0, 255, 255, 0.5), 0 0 40px rgba(147, 51, 234, 0.3)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="w-full h-full rounded-full gradient-cypher flex items-center justify-center relative overflow-hidden border-2 border-cyan-500/50"
              >
                {/* Try to load logo, fallback to text */}
                <div className="relative w-48 h-24 md:w-64 md:h-32">
                  <motion.div
                    animate={{
                      filter: [
                        'drop-shadow(0 0 5px #00FFFF)',
                        'drop-shadow(0 0 15px #00FFFF) drop-shadow(0 0 25px #9333EA)',
                        'drop-shadow(0 0 5px #00FFFF)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src="/cypher-hero-logo.png"
                      alt="Cypher Hero"
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                    <div className="hidden flex-col items-center justify-center text-white font-cyber font-black">
                      <div
                        className="text-3xl md:text-4xl mb-1"
                        style={{
                          background: 'linear-gradient(135deg, #00FFFF 0%, #00CED1 25%, #40E0D0 50%, #9333EA 75%, #6B21A8 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          textShadow: '0 0 10px rgba(0, 255, 255, 0.5)',
                        }}
                      >
                        CYPHER
                      </div>
                      <div
                        className="text-3xl md:text-4xl"
                        style={{
                          background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C42 50%, #FF4444 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          backgroundClip: 'text',
                          textShadow: '0 0 10px rgba(255, 68, 68, 0.5)',
                        }}
                      >
                        HERO
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Current Position Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-white rounded-lg p-4 shadow-lg text-center"
        >
          <p className="text-gray-600 mb-1">
            {language === 'en' ? 'Current Position' : 'Mevcut Konum'}
          </p>
          <p className="text-2xl font-bold text-primary-turquoise">
            {BOARD_SQUARES[playerPosition]}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
