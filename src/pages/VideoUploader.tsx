import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, Loader2 } from "lucide-react";

export default function VideoUploader() {
  const [video, setVideo] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!video || !caption || platforms.length === 0) return;

    setLoading(true);
    try {
      // TODO: Upload to backend or trigger integration
      const formData = new FormData();
      formData.append("file", video);
      formData.append("caption", caption);
      formData.append("platforms", JSON.stringify(platforms));

      // Example: await fetch("/api/upload", { method: "POST", body: formData });

      alert("Upload successful! (Simulated)");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
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

        <Button
          disabled={loading || !video || !caption || platforms.length === 0}
          onClick={handleUpload}
          className="w-full"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
          {loading ? "Uploading..." : "Upload & Publish"}
        </Button>
      </CardContent>
    </Card>
  );
}
