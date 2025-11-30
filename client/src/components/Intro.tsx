import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Message } from "@/lib/store";

interface IntroProps {
  onComplete: () => void;
  messages: Message[];
}

export function Intro({ onComplete, messages }: IntroProps) {
  const [step, setStep] = useState(0);

  // Filter messages with images for the glimpse section
  const photoMessages = messages.filter(m => m.images && m.images.length > 0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1000);
    const timer2 = setTimeout(() => setStep(2), 4000);
    const timer3 = setTimeout(() => setStep(3), 7000);
    const timer4 = setTimeout(() => setStep(4), 10000);
    const timer5 = setTimeout(() => {
      onComplete();
    }, 14000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
    };
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 2, ease: "easeInOut" }}
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
            transition={{ duration: 2 }}
            className="absolute text-center"
          >
            <h1 className="text-8xl font-display text-pink-300 drop-shadow-[0_0_25px_rgba(249,168,212,0.6)]">
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
            transition={{ duration: 1.5 }}
            className="absolute text-center"
          >
            <p className="text-3xl font-light italic text-white/80">
              "Every message, a memory..."
            </p>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            className="absolute inset-0 flex items-center justify-center"
            exit={{ opacity: 0 }}
          >
             {/* Fast moving collage effect with all available images */}
             <div className="relative w-full h-full">
               {photoMessages.slice(0, 8).flatMap((msg, msgIdx) => 
                 msg.images!.map((img, imgIdx) => (
                   <motion.div
                     key={`${msg.id}-${imgIdx}`}
                     initial={{ opacity: 0, scale: 0.5, x: Math.random() * 400 - 200, y: Math.random() * 400 - 200 }}
                     animate={{ opacity: 0.6, scale: 1 }}
                     exit={{ opacity: 0, scale: 1.5 }}
                     transition={{ duration: 3, delay: (msgIdx + imgIdx) * 0.2 }}
                     className="absolute top-1/2 left-1/2 w-64 h-64 -ml-32 -mt-32"
                     style={{ rotate: Math.random() * 20 - 10 }}
                   >
                     <img src={img} className="w-full h-full object-cover rounded-lg shadow-2xl" alt="" />
                   </motion.div>
                 ))
               )}
               <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 2 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm"
               >
                  <h2 className="text-5xl font-display text-white">Enjoy your day ✨</h2>
               </motion.div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
