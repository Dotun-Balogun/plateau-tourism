"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, Trash2, Video } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { attachMedia, deleteMedia } from "@/app/admin/destinations/actions";

type MediaAsset = {
  id: string;
  kind: string;
  storage_path: string;
  caption: string | null;
};

const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50MB, matches supabase/config.toml

export function MediaManager({
  destinationId,
  initialMedia,
}: {
  destinationId: string;
  initialMedia: MediaAsset[];
}) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setIsUploading(true);

    const supabase = createClient();

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_BYTES) {
        toast.error(`${file.name} is larger than 50MB and was skipped.`);
        continue;
      }

      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      if (!isVideo && !isImage) {
        toast.error(`${file.name} isn't an image or video and was skipped.`);
        continue;
      }

      const ext = file.name.split(".").pop();
      const path = `${destinationId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("destination-media")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}: ${uploadError.message}`);
        continue;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("destination-media").getPublicUrl(path);

      const result = await attachMedia(
        destinationId,
        publicUrl,
        isVideo ? "video" : "image",
        null
      );

      if (result?.error) {
        toast.error(result.error);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  async function handleDelete(media: MediaAsset) {
    setIsDeleting(media.id);
    const result = await deleteMedia(media.id, destinationId, media.storage_path);
    setIsDeleting(null);

    if (result?.error) {
      toast.error(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ImagePlus className="size-4" />
          )}
          {isUploading ? "Uploading..." : "Upload photos or videos"}
        </Button>
        <p className="mt-1 text-xs text-muted-foreground">
          JPG, PNG, WEBP, MP4, or MOV — up to 50MB each. You can select
          multiple files at once.
        </p>
      </div>

      {initialMedia.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {initialMedia.map((m) => (
            <Card key={m.id} className="overflow-hidden py-0">
              <CardContent className="relative p-0">
                {m.kind === "video" ? (
                  <div className="relative aspect-square bg-muted">
                    <video
                      src={m.storage_path}
                      className="size-full object-cover"
                      muted
                    />
                    <Video className="absolute top-2 left-2 size-4 text-white drop-shadow" />
                  </div>
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.storage_path}
                    alt={m.caption ?? ""}
                    className="aspect-square w-full object-cover"
                  />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 size-7"
                  disabled={isDeleting === m.id}
                  onClick={() => handleDelete(m)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          No media uploaded yet.
        </p>
      )}
    </div>
  );
}
