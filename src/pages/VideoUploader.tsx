import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export default function VideoUploader() {
  const [video, setVideo] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [scheduleAt, setScheduleAt] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleUpload = async () => {
    if (!video || !caption || platforms.length === 0) return;

    setLoading(true);
    try {
      const fileExt = video.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, video, {
          cacheControl: '3600',
          upsert: false,
          contentType: video.type || 'video/mp4'
        });

      if (uploadError) {
        const message = uploadError.message?.includes('does not exist')
          ? "Storage bucket 'videos' not found. Please create a public bucket named 'videos' in Supabase."
          : uploadError.message;
        throw new Error(message);
      }

      const { data: publicUrlData } = supabase.storage.from('videos').getPublicUrl(filePath);
      const publicUrl = publicUrlData.publicUrl;

      // If scheduled time provided and user authenticated, create a scheduled post
      if (scheduleAt && user) {
        const iso = new Date(scheduleAt).toISOString();
        const { error: insertError } = await supabase.from('scheduled_posts').insert({
          user_id: user.id,
          video_url: publicUrl,
          caption,
          platforms,
          scheduled_at: iso,
          status: 'pending'
        });
        if (insertError) throw insertError;
        toast({ title: "Scheduled", description: `Post scheduled for ${new Date(iso).toLocaleString()}` });
      } else {
        toast({ title: "Upload successful", description: `Uploaded to: ${publicUrl}` });
      }

      setVideo(null);
      setCaption("");
      setPlatforms([]);
      setScheduleAt("");
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      console.error(err);
      toast({
        title: "Upload failed",
        description: message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (platform: string) => {
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" /> Upload & Distribute Video
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input type="file" accept="video/*" onChange={(e) => setVideo(e.target.files?.[0] || null)} />
        <Textarea placeholder="Write a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />

        <div className="space-x-2">
          {['TikTok', 'Instagram', 'YouTube', 'LinkedIn', 'X'].map((platform) => (
            <Badge
              key={platform}
              variant={platforms.includes(platform) ? "default" : "outline"}
              onClick={() => togglePlatform(platform)}
              className="cursor-pointer"
            >
              {platform}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
          <label htmlFor="scheduleAt" className="text-sm text-muted-foreground">Schedule (optional)</label>
          <Input
            id="scheduleAt"
            type="datetime-local"
            value={scheduleAt}
            onChange={(e) => setScheduleAt(e.target.value)}
          />
        </div>

        <Button
          disabled={loading || !video || !caption || platforms.length === 0}
          onClick={handleUpload}
          className="w-full"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
          {loading ? "Uploading..." : scheduleAt ? "Upload & Schedule" : "Upload & Publish"}
        </Button>
      </CardContent>
    </Card>
  );
}
