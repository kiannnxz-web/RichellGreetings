import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface IntroProps {
  onComplete: () => void;
}

export function Intro({ onComplete }: IntroProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1000); // "Made by Kian"
    const timer2 = setTimeout(() => setStep(2), 3500); // "For Richell"
    const timer3 = setTimeout(() => setStep(3), 6000); // "Showcasing..."
    const timer4 = setTimeout(() => {
      onComplete();
    }, 8500); // End

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.2, filter: "blur(10px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute text-center"
          >
            <p className="text-xl text-gray-400 font-light tracking-[0.2em] uppercase mb-2">A Gift</p>
            <h1 className="text-6xl font-display text-white">Made by Kian</h1>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.5 }}
            className="absolute text-center"
          >
            <h1 className="text-7xl font-display text-pink-300 drop-shadow-[0_0_15px_rgba(249,168,212,0.5)]">
              For Richell
            </h1>
          </motion.div>
        )}

         {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute text-center"
          >
            <p className="text-2xl font-light italic text-white/80">
              "Collecting memories..."
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
