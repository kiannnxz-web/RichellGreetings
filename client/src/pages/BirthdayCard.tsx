import { useMessages } from "@/lib/store";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Plus, Share2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/Confetti";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function BirthdayCard() {
  const { messages } = useMessages();
  const { toast } = useToast();

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Share this link with Richell or friends!",
    });
  };

  return (
    <div className="min-h-screen pb-20">
      <Confetti />
      
      {/* Hero Section */}
      <header className="relative py-20 text-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 container mx-auto px-4"
        >
          <div className="inline-block p-3 mb-4 rounded-full bg-white/50 backdrop-blur-sm border border-pink-200">
            <span className="text-2xl">🎂</span>
          </div>
          <h1 className="text-5xl md:text-7xl text-primary mb-6 drop-shadow-sm">
            Happy Birthday<br/>
            <span className="text-secondary-foreground">Richell!</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-medium">
            Wishing you a day filled with love, laughter, and everything you wished for.
            Here's what your friends have to say:
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link href="/sign">
              <Button size="lg" className="rounded-full text-lg px-8 shadow-lg hover:scale-105 transition-transform bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-5 w-5" /> Sign the Card
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="rounded-full text-lg px-8 bg-white/80 hover:bg-white" onClick={handleShare}>
              <Share2 className="mr-2 h-5 w-5" /> Share
            </Button>
          </div>
        </motion.div>
      </header>

      {/* Messages Grid */}
      <main className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              style={{ rotate: `${msg.rotation}deg` }}
            >
              <Card className={`h-full border-none shadow-md hover:shadow-xl transition-all duration-300 ${msg.color}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/50 flex items-center justify-center font-display text-primary">
                      {msg.name[0]}
                    </div>
                    <CardTitle className="font-display text-xl">{msg.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {msg.image && (
                    <div className="mb-4 rounded-lg overflow-hidden border-4 border-white shadow-sm">
                      <img src={msg.image} alt="Memory" className="w-full h-48 object-cover" />
                    </div>
                  )}
                  <p className="text-lg leading-relaxed font-medium text-gray-800 whitespace-pre-wrap">
                    {msg.text}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
