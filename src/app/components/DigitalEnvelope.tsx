import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface DigitalEnvelopeProps {
  onOpenComplete: () => void;
  lang: 'am' | 'en';
}

export function DigitalEnvelope({ onOpenComplete }: DigitalEnvelopeProps) {
  const [opening, setOpening] = useState(false);
  const onOpenCompleteRef = useRef(onOpenComplete);

  useEffect(() => {
    onOpenCompleteRef.current = onOpenComplete;
  }, [onOpenComplete]);

  useEffect(() => {
    if (!opening) return;

    const completeTimer = window.setTimeout(() => onOpenCompleteRef.current(), 1500);

    return () => {
      window.clearTimeout(completeTimer);
    };
  }, [opening]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#f4eee2] select-none"
      animate={opening ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.5, delay: opening ? 1 : 0 }}
    >
      <motion.button
        type="button"
        aria-label="Open invitation"
        className="relative w-full h-full cursor-pointer overflow-hidden border-0 bg-transparent p-0 outline-none flex items-center justify-center"
        onClick={() => {
          if (!opening) setOpening(true);
        }}
        animate={opening ? { scale: 1.02 } : { scale: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      >
        {/* Envelope image displayed fullscreen */}
        <img
          src="/envelop.png"
          alt="Wedding envelope - Tap to open"
          className="w-full h-full object-cover object-center"
          draggable={false}
        />
      </motion.button>
    </motion.div>
  );
}
