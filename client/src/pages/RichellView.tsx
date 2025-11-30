import { useMessages } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Confetti } from "@/components/Confetti";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Intro } from "@/components/Intro";
import { useState } from "react";
import { Sparkles, ChevronLeft, ChevronRight, X, Film } from "lucide-react";

export default function RichellView() {
  const { messages } = useMessages();
  const [showIntro, setShowIntro] = useState(true);
  const [mediaSlides, setMediaSlides] = useState<{ [key: string]: number }>({});
  const [lightboxMedia, setLightboxMedia] = useState<{ src: string; type: 'image' | 'video' } | null>(null);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const getMediaArray = (msg: any) => {
    const media: Array<{ src: string; type: 'image' | 'video' }> = [];
    if (msg.images) {
      msg.images.forEach((img: string) => media.push({ src: img, type: 'image' }));
    }
    if (msg.videos) {
      msg.videos.forEach((vid: string) => media.push({ src: vid, type: 'video' }));
    }
    return media;
  };

  const nextMedia = (msgId: string, maxMedia: number) => {
    setMediaSlides(prev => ({
      ...prev,
      [msgId]: ((prev[msgId] || 0) + 1) % maxMedia
    }));
  };

  const prevMedia = (msgId: string, maxMedia: number) => {
    setMediaSlides(prev => ({
      ...prev,
      [msgId]: ((prev[msgId] || 0) - 1 + maxMedia) % maxMedia
    }));
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && <Intro onComplete={handleIntroComplete} messages={messages} />}
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
                        {(() => {
                          const mediaArray = getMediaArray(msg);
                          if (mediaArray.length > 0) {
                            const currentMedia = mediaArray[mediaSlides[msg.id] || 0];
                            return (
                              <div className="mb-6 relative">
                                <div 
                                  className="rounded-xl overflow-hidden border-4 border-white shadow-md transform rotate-1 group-hover:rotate-0 transition-transform duration-500 cursor-pointer"
                                  onClick={() => setLightboxMedia(currentMedia)}
                                  data-testid={`media-preview-${msg.id}`}
                                >
                                  {currentMedia.type === 'image' ? (
                                    <img 
                                      src={currentMedia.src} 
                                      alt="Memory" 
                                      className="w-full h-64 object-cover" 
                                    />
                                  ) : (
                                    <div className="relative bg-black">
                                      <video 
                                        src={currentMedia.src} 
                                        className="w-full h-64 object-cover" 
                                        controls={false}
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                        <Film className="h-12 w-12 text-white" />
                                      </div>
                                    </div>
                                  )}
                                </div>
                                {mediaArray.length > 1 && (
                                  <div className="flex items-center justify-between mt-2 px-2">
                                    <button
                                      onClick={() => prevMedia(msg.id, mediaArray.length)}
                                      className="p-1 rounded-full bg-white/50 hover:bg-white transition-colors"
                                      data-testid={`button-prev-media-${msg.id}`}
                                    >
                                      <ChevronLeft className="h-4 w-4 text-gray-800" />
                                    </button>
                                    <span className="text-sm text-gray-600">
                                      {(mediaSlides[msg.id] || 0) + 1} / {mediaArray.length}
                                    </span>
                                    <button
                                      onClick={() => nextMedia(msg.id, mediaArray.length)}
                                      className="p-1 rounded-full bg-white/50 hover:bg-white transition-colors"
                                      data-testid={`button-next-media-${msg.id}`}
                                    >
                                      <ChevronRight className="h-4 w-4 text-gray-800" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          }
                          return null;
                        })()}
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

          {/* Lightbox Modal */}
          <AnimatePresence>
            {lightboxMedia && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                onClick={() => setLightboxMedia(null)}
                data-testid="lightbox-modal"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="max-w-4xl max-h-[90vh] relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {lightboxMedia.type === 'image' ? (
                    <img 
                      src={lightboxMedia.src} 
                      alt="Full view" 
                      className="w-full h-full object-contain rounded-lg"
                      data-testid="lightbox-image"
                    />
                  ) : (
                    <video 
                      src={lightboxMedia.src} 
                      className="w-full h-full object-contain rounded-lg"
                      controls
                      autoPlay
                      data-testid="lightbox-video"
                    />
                  )}
                  <button
                    onClick={() => setLightboxMedia(null)}
                    className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                    data-testid="button-close-lightbox"
                  >
                    <X className="h-8 w-8" />
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}
