import { useMessages } from "@/lib/store";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const { messages } = useMessages();

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-pink-50 to-white">
      {/* Hero Section */}
      <header className="relative py-20 text-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 container mx-auto px-4"
        >
          <div className="inline-block p-3 mb-4 rounded-full bg-white/50 backdrop-blur-sm border border-pink-200">
            <span className="text-2xl">💌</span>
          </div>
          <h1 className="text-5xl md:text-7xl text-primary mb-6 font-display">
            Birthday Greetings<br/>
            <span className="text-secondary-foreground">for Richell</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-body">
            Join us in celebrating Richell's special day! Leave a message, share memories and photos!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/sign">
              <Button size="lg" className="rounded-full text-lg px-8 bg-primary hover:bg-primary/90 shadow-lg hover:scale-105 transition-all">
                <Plus className="mr-2 h-5 w-5" /> Write a Message
              </Button>
            </Link>
          </div>
        </motion.div>
      </header>

      {/* Messages Grid Preview */}
      <main className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display text-gray-700">Recent Messages ({messages.length})</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {messages.length === 0 ? (
             <div className="col-span-full text-center py-12 bg-white/50 rounded-xl border border-dashed border-pink-200">
               <p className="text-muted-foreground text-lg">No messages yet. Be the first to write one!</p>
             </div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative"
                style={{ rotate: `${msg.rotation}deg` }}
              >
                <Card className={`h-full border-none shadow-sm hover:shadow-md transition-all ${msg.color}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-white/50 flex items-center justify-center font-display text-primary">
                        {msg.name[0]}
                      </div>
                      <CardTitle className="font-display text-lg">{msg.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {msg.images && msg.images.length > 0 && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-white/50">
                        <img src={msg.images[0]} alt="Memory" className="w-full h-24 object-cover" />
                        {msg.images.length > 1 && (
                          <p className="text-xs text-gray-500 p-1 text-center">+{msg.images.length - 1} more</p>
                        )}
                      </div>
                    )}
                    <p className="text-gray-800 line-clamp-3 font-handwriting">
                      {msg.text}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
