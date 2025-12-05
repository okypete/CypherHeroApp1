'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';

interface QRCodeScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
}

export default function QRCodeScanner({ onScanSuccess, onClose }: QRCodeScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useGameStore();
  
  const translations = {
    en: {
      title: 'Scan QR Code',
      subtitle: 'Point your camera at the QR code',
      error: 'Failed to start camera',
      permission: 'Make sure you\'ve granted camera permissions',
      cancel: 'Cancel',
    },
    tr: {
      title: 'QR Kod Tara',
      subtitle: 'Kameranızı QR koda doğrultun',
      error: 'Kamera başlatılamadı',
      permission: 'Kamera izinlerini verdiğinizden emin olun',
      cancel: 'İptal',
    },
  };
  
  const t = translations[language];

  useEffect(() => {
    const startScanning = async () => {
      try {
        const html5QrCode = new Html5Qrcode('qr-reader');
        scannerRef.current = html5QrCode;

        // Get available cameras and find back camera (for iOS and Android)
        let cameraId: string | null = null;
        try {
          const devices = await Html5Qrcode.getCameras();
          
          // Try to find back camera by label (works on iOS and Android)
          for (const device of devices) {
            const label = device.label.toLowerCase();
            // Check for back/rear camera indicators
            if (label.includes('back') || 
                label.includes('rear') ||
                label.includes('environment') ||
                label.includes('facing back') ||
                label.includes('camera2') || // Android sometimes uses camera2 for back
                (devices.length > 1 && device === devices[devices.length - 1])) { // Often last camera is back
              cameraId = device.id;
              break;
            }
          }
        } catch (camError) {
          console.log('Could not enumerate cameras, using facingMode');
        }

        // Camera configuration: 
        // - Prefer specific camera ID if found (more reliable)
        // - Fallback to 'environment' facingMode (back camera on iOS/Android)
        const cameraConfig = cameraId 
          ? { deviceId: { exact: cameraId } }
          : { facingMode: 'environment' }; // 'environment' = back camera on mobile devices

        await html5QrCode.start(
          cameraConfig,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0, // Square aspect ratio for better QR scanning
          },
          (decodedText) => {
            // Success callback
            html5QrCode.stop().then(() => {
              setScanning(false);
              onScanSuccess(decodedText);
            }).catch(() => {
              setScanning(false);
            });
          },
          (errorMessage) => {
            // Error callback - ignore, it's just scanning
          }
        );
        
        setScanning(true);
        setError(null);
      } catch (err: any) {
        console.error('Error starting QR scanner:', err);
        setError(err.message || t.error);
        setScanning(false);
      }
    };

    startScanning();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {
          // Ignore errors when stopping
        });
      }
    };
  }, [onScanSuccess, t]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="gaming-card p-6 rounded-2xl shadow-2xl border-2 border-neon-purple/50 max-w-md w-full"
      >
        <div className="text-center mb-4">
          <h3 className="text-2xl font-bold text-white mb-2 neon-text-purple">
            {t.title}
          </h3>
          <p className="text-gray-400 text-sm">
            {t.subtitle}
          </p>
        </div>

        <div className="relative mb-4">
          <div
            id="qr-reader"
            ref={containerRef}
            className="w-full rounded-lg overflow-hidden bg-black"
            style={{ minHeight: '300px' }}
          />
          
          {!scanning && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
              <p className="text-white">Starting camera...</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm text-center">{error}</p>
            <p className="text-gray-400 text-xs text-center mt-2">
              {t.permission}
            </p>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="w-full bg-gradient-to-r from-neon-purple via-neon-orange to-neon-blue text-white font-bold py-3 rounded-lg neon-glow-purple"
        >
          {t.cancel}
        </motion.button>
      </motion.div>
    </div>
  );
}

