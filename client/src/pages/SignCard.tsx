import { useState } from "react";
import { useLocation } from "wouter";
import { useMessages } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Image as ImageIcon, Send, Trash2, Film } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function SignCard() {
  const [, setLocation] = useLocation();
  const { addMessage } = useMessages();
  const { toast } = useToast();
  
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    addMessage({
      name,
      text,
      images: imagePreviews.length > 0 ? imagePreviews : undefined,
      videos: videoPreviews.length > 0 ? videoPreviews : undefined,
    });

    toast({
      title: "Message Sent!",
      description: "Your birthday wish has been added to the card.",
    });

    setLocation("/");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setVideoPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideoPreviews(prev => prev.filter((_, i) => i !== index));
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
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
                <Label className="text-lg">Add Media (Optional)</Label>
                
                {/* Images Section */}
                <div className="space-y-2">
                  <Label htmlFor="images" className="text-sm cursor-pointer flex items-center gap-2 hover:text-primary transition-colors">
                    <ImageIcon className="h-4 w-4" /> Photos
                  </Label>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {imagePreviews.map((preview, i) => (
                        <div key={i} className="relative rounded-lg overflow-hidden border-2 border-pink-100">
                          <img src={preview} alt={`Preview ${i}`} className="w-full h-20 object-cover" />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeImage(i)}
                            data-testid={`button-remove-image-${i}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div 
                    onClick={() => document.getElementById('images')?.click()}
                    className="border-2 border-dashed border-pink-200 rounded-lg p-4 text-center cursor-pointer hover:bg-pink-50/50 transition-colors"
                    data-testid="area-upload-images"
                  >
                    <p className="text-sm text-muted-foreground">Click to add photos ({imagePreviews.length})</p>
                  </div>
                </div>

                {/* Videos Section */}
                <div className="space-y-2">
                  <Label htmlFor="videos" className="text-sm cursor-pointer flex items-center gap-2 hover:text-primary transition-colors">
                    <Film className="h-4 w-4" /> Videos
                  </Label>
                  <Input
                    id="videos"
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                  
                  {videoPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {videoPreviews.map((preview, i) => (
                        <div key={i} className="relative rounded-lg overflow-hidden border-2 border-purple-100 bg-gray-100">
                          <video src={preview} className="w-full h-20 object-cover" />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Film className="h-5 w-5 text-white" />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => removeVideo(i)}
                            data-testid={`button-remove-video-${i}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div 
                    onClick={() => document.getElementById('videos')?.click()}
                    className="border-2 border-dashed border-purple-200 rounded-lg p-4 text-center cursor-pointer hover:bg-purple-50/50 transition-colors"
                    data-testid="area-upload-videos"
                  >
                    <p className="text-sm text-muted-foreground">Click to add videos ({videoPreviews.length})</p>
                  </div>
                </div>
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
