import { useMessages } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Confetti } from "@/components/Confetti";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Intro } from "@/components/Intro";
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export default function RichellView() {
  const { messages } = useMessages();
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    // For Richell's page, we always show intro on first load of the session
    // But if they refresh, maybe we skip? 
    // User requested "intro it", so let's keep it simple and show it.
    // But let's use a specific key for Richell so it doesn't conflict with other views if any.
    const hasSeenIntro = sessionStorage.getItem("hasSeenRichellIntro");
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem("hasSeenRichellIntro", "true");
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && <Intro onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {!showIntro && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1.5 }}
          className="min-h-screen pb-20 bg-gradient-to-b from-pink-50 to-white overflow-x-hidden"
        >
          <Confetti />
          
          {/* Hero Section */}
          <header className="relative py-24 text-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-10 container mx-auto px-4"
            >
              <div className="inline-block p-4 mb-6 rounded-full bg-white/80 backdrop-blur-md border border-pink-200 shadow-sm animate-bounce-slow">
                <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              </div>
              <h1 className="text-6xl md:text-9xl font-display text-primary mb-6 drop-shadow-sm tracking-tight">
                Happy Birthday<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-300% animate-gradient">
                  Richell!
                </span>
              </h1>
              <p className="text-xl md:text-3xl text-muted-foreground max-w-3xl mx-auto mb-10 font-light leading-relaxed font-display">
                "Here are the hearts that beat for you today."
              </p>
            </motion.div>
            
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
              <div className="absolute top-20 left-10 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-blob" />
              <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
              <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>
          </header>

          {/* Messages Grid - The Main Event */}
          <main className="container mx-auto px-4">
            {messages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      delay: index * 0.2, 
                      type: "spring", 
                      stiffness: 40,
                      damping: 15 
                    }}
                    whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                    className="relative group"
                    style={{ rotate: `${msg.rotation}deg` }}
                  >
                    <Card className={`h-full border-none shadow-lg group-hover:shadow-2xl transition-all duration-500 ${msg.color} backdrop-blur-md bg-opacity-90`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center font-display text-2xl text-primary border border-pink-100">
                            {msg.name[0].toUpperCase()}
                          </div>
                          <div>
                            <CardTitle className="font-display text-2xl text-gray-800">{msg.name}</CardTitle>
                            <p className="text-sm text-gray-500 font-sans">
                              {new Date(msg.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {msg.image && (
                          <div className="mb-6 rounded-xl overflow-hidden border-4 border-white shadow-md transform rotate-1 group-hover:rotate-0 transition-transform duration-500">
                            <img src={msg.image} alt="Memory" className="w-full h-64 object-cover" />
                          </div>
                        )}
                        <p className="text-xl leading-relaxed font-medium text-gray-800 whitespace-pre-wrap font-handwriting">
                          "{msg.text}"
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 opacity-50">
                <p className="text-2xl font-display">Waiting for the first wish to arrive...</p>
              </div>
            )}
          </main>
          
          <footer className="text-center py-10 text-gray-400 text-sm">
            Made with ❤️ by Kian
          </footer>
        </motion.div>
      )}
    </>
  );
}
