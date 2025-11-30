import { useMessages } from "@/lib/store";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/Confetti";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Intro } from "@/components/Intro";
import { useState, useEffect } from "react";

export default function BirthdayCard() {
  const { messages } = useMessages();
  const { toast } = useToast();
  const [showIntro, setShowIntro] = useState(true);

  // Check if we've seen the intro before in this session to avoid annoyance during dev
  // But for the "app" feel user requested, we might want it to run. 
  // Let's use a session storage flag so it runs on refresh but not nav back.
  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro) {
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem("hasSeenIntro", "true");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Ready for Richell! 🎁",
      description: "Link copied to clipboard. Send it to her!",
    });
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
          className="min-h-screen pb-20 bg-gradient-to-b from-pink-50 to-white"
        >
          <Confetti />
          
          {/* Hero Section */}
          <header className="relative py-24 text-center overflow-hidden">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative z-10 container mx-auto px-4"
            >
              <div className="inline-block p-4 mb-6 rounded-full bg-white/80 backdrop-blur-md border border-pink-200 shadow-sm">
                <Sparkles className="w-8 h-8 text-yellow-400 fill-yellow-400 animate-pulse" />
              </div>
              <h1 className="text-6xl md:text-8xl text-primary mb-6 drop-shadow-sm tracking-tight">
                Happy Birthday<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                  Richell!
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                A collection of memories and wishes, curated just for you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/sign">
                  <Button size="lg" className="rounded-full text-lg px-10 py-6 shadow-xl hover:scale-105 transition-all duration-300 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 border-none ring-2 ring-offset-2 ring-pink-200">
                    <Plus className="mr-2 h-5 w-5" /> Add Your Message
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full text-lg px-10 py-6 bg-white/80 hover:bg-white hover:text-pink-500 border-pink-200 hover:border-pink-300 transition-all duration-300" 
                  onClick={handleShare}
                >
                  <Share2 className="mr-2 h-5 w-5" /> Copy Link for Richell
                </Button>
              </div>
            </motion.div>
            
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
              <div className="absolute top-20 left-10 w-64 h-64 bg-pink-300/20 rounded-full blur-3xl animate-blob" />
              <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
              <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>
          </header>

          {/* Messages Grid */}
          <main className="container mx-auto px-4">
            {messages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15, type: "spring", stiffness: 50 }}
                    whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
                    className="relative"
                    style={{ rotate: `${msg.rotation}deg` }}
                  >
                    <Card className={`h-full border-none shadow-lg hover:shadow-2xl transition-all duration-500 ${msg.color} backdrop-blur-sm bg-opacity-90`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white shadow-sm flex items-center justify-center font-display text-xl text-primary border border-pink-100">
                            {msg.name[0].toUpperCase()}
                          </div>
                          <div>
                            <CardTitle className="font-display text-xl text-gray-800">{msg.name}</CardTitle>
                            <p className="text-xs text-gray-500 font-sans">
                              {new Date(msg.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {msg.image && (
                          <div className="mb-4 rounded-xl overflow-hidden border-4 border-white shadow-md transform rotate-1">
                            <img src={msg.image} alt="Memory" className="w-full h-56 object-cover hover:scale-105 transition-transform duration-700" />
                          </div>
                        )}
                        <p className="text-lg leading-relaxed font-medium text-gray-700 whitespace-pre-wrap font-handwriting">
                          "{msg.text}"
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 opacity-50">
                <p className="text-xl">No messages yet. Be the first to sign!</p>
              </div>
            )}
          </main>
        </motion.div>
      )}
    </>
  );
}
