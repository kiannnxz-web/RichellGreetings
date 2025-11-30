import { useState } from "react";
import { useMessages, Message } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Save, X, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Admin() {
  const { messages, deleteMessage, updateMessage } = useMessages();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Message>>({});

  const handleEdit = (msg: Message) => {
    setEditingId(msg.id);
    setEditForm(msg);
  };

  const handleSave = () => {
    if (editingId && editForm) {
      updateMessage(editingId, editForm);
      setEditingId(null);
      setEditForm({});
      toast({
        title: "Message Updated",
        description: "Changes have been saved successfully.",
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this message?")) {
      deleteMessage(id);
      toast({
        title: "Message Deleted",
        description: "The message has been removed.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveImage = (imageIndex: number) => {
    if (editForm.images) {
      const newImages = editForm.images.filter((_, i) => i !== imageIndex);
      setEditForm({...editForm, images: newImages.length > 0 ? newImages : undefined});
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
        
        <div className="grid gap-6">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No messages to manage yet.</p>
          ) : (
            messages.map((msg) => (
              <Card key={msg.id} className="overflow-hidden">
                <CardHeader className="bg-gray-100 flex flex-row items-center justify-between py-3">
                  <div className="font-mono text-sm text-gray-500">{msg.id}</div>
                  <div className="flex gap-2">
                    {editingId === msg.id ? (
                      <>
                        <Button size="sm" variant="default" onClick={handleSave}>
                          <Save className="h-4 w-4 mr-1" /> Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => handleEdit(msg)}>
                          <Edit2 className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(msg.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  {editingId === msg.id ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Name</label>
                        <Input 
                          value={editForm.name || ""} 
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Message</label>
                        <Textarea 
                          value={editForm.text || ""} 
                          onChange={(e) => setEditForm({...editForm, text: e.target.value})} 
                          className="min-h-[100px]"
                        />
                      </div>
                      {editForm.images && editForm.images.length > 0 && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">Images ({editForm.images.length})</label>
                          <div className="grid grid-cols-3 gap-2">
                            {editForm.images.map((img, i) => (
                              <div key={i} className="relative">
                                <img src={img} alt={`Edit ${i}`} className="w-full h-20 object-cover rounded-md" />
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="destructive"
                                  className="absolute top-1 right-1 h-6 w-6 p-0"
                                  onClick={() => handleRemoveImage(i)}
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-[200px_1fr] gap-4">
                      <div>
                        <p className="font-bold text-lg">{msg.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(msg.timestamp).toLocaleString()}
                        </p>
                        {msg.images && msg.images.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium text-gray-600">{msg.images.length} image(s)</p>
                            <div className="grid grid-cols-2 gap-1">
                              {msg.images.map((img, i) => (
                                <img 
                                  key={i}
                                  src={img} 
                                  alt={`Thumb ${i}`} 
                                  className="w-full h-12 object-cover rounded border"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="whitespace-pre-wrap text-gray-700">{msg.text}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
