import { useState } from "react";
import { useLocation } from "wouter";
import { useMessages } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Image as ImageIcon, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function SignCard() {
  const [, setLocation] = useLocation();
  const { addMessage } = useMessages();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    addMessage({
      name,
      text,
      image: imagePreview || undefined,
    });

    toast({
      title: "Message Sent!",
      description: "Your birthday wish has been added to the card.",
    });

    setLocation("/");
  };

  // Mock image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Button 
          variant="ghost" 
          className="mb-6 hover:bg-transparent hover:text-primary"
          onClick={() => setLocation("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Card
        </Button>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-primary">Write a Message ✍️</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">Your Name</Label>
                <Input
                  id="name"
                  placeholder="Who is this from?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-lg bg-white/50 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-lg">Your Message</Label>
                <Textarea
                  id="message"
                  placeholder="Write something sweet..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[150px] text-lg bg-white/50 border-pink-200 focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-lg cursor-pointer flex items-center gap-2 hover:text-primary transition-colors">
                  <ImageIcon className="h-5 w-5" /> Add a Photo (Optional)
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {imagePreview && (
                  <div className="relative mt-2 rounded-lg overflow-hidden border-2 border-pink-100">
                    <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => setImagePreview(null)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
                {!imagePreview && (
                  <div 
                    onClick={() => document.getElementById('image')?.click()}
                    className="border-2 border-dashed border-pink-200 rounded-lg p-8 text-center cursor-pointer hover:bg-pink-50/50 transition-colors"
                  >
                    <p className="text-muted-foreground">Click to upload a memory</p>
                  </div>
                )}
              </div>

              <Button type="submit" size="lg" className="w-full text-lg bg-primary hover:bg-primary/90 shadow-lg">
                <Send className="mr-2 h-5 w-5" /> Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
