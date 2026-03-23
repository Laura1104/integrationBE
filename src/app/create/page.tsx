"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { uploadFiles } from "@/lib/uploadthing";
import { UploadDropzone } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

type Tab = "post" | "reel";

export default function CreatePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("post");
  const [preview, setPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [audioTrack, setAudioTrack] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadedUrl, setUploadedUrl]= useState <string | null> (null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show a local preview so the user can see what they picked
    setPreview(URL.createObjectURL(file));

    // (YA) TODO: Upload the file to UploadThing here and save the returned URL.
    // 1. Install: npm install uploadthing @uploadthing/react
    // 2. Create your file router at /src/app/api/uploadthing/core.ts
    // 3. Upload and save the URL:
    //      const [result] = await uploadFiles("imageUploader", { files: [file] });
    //      setUploadedUrl(result.url);

    const uploader = tab === "post" ? "imageUploader" : "videoUploader";
    const [result] = await uploadFiles(uploader, { files: [file] });
    setUploadedUrl(result.url);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadedUrl) { setError("Please select a file."); return; }

    setLoading(true);
    setError(null);

    try {
      if (tab === "post") {
        // (YA) TODO: Replace `preview` with the real URL returned by UploadThing after upload.
        // (YA) TODO: Change the URL below to your real backend endpoint.
        // Example: fetch("https://your-api.com/posts", { method: "POST", ... })
        await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: uploadedUrl, caption, location }),
        });
        toast.success ("Post creado correctamente")
      } else {
        // (YA) TODO: Replace `preview` with the real URL returned by UploadThing after upload.
        // (YA) TODO: Change the URL below to your real backend endpoint.
        // Example: fetch("https://your-api.com/reels", { method: "POST", ... })
        await fetch("/api/reels", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ videoUrl: uploadedUrl, thumbnailUrl: uploadedUrl, caption, audioTrack }),
        });
        toast.success ("Reel creado correctamente")
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="text-xl font-bold mb-6">Create new {tab}</h1>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
        {(["post", "reel"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setPreview(null); }}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-colors ${
              tab === t ? "bg-white shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* File picker */}
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors overflow-hidden"
        >
          {preview ? (
            tab === "post" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <video src={preview} className="w-full h-full object-cover" muted loop autoPlay playsInline />
            )
          ) : (
            <UploadDropzone<OurFileRouter, "imageUploader" | "videoUploader">
              endpoint={tab === "post" ? "imageUploader" : "videoUploader"}
              onClientUploadComplete={(res) => {
                setUploadedUrl(res[0].url);
                setPreview(res[0].url);
                toast.success("Upload complete!");
              }}
              onUploadError={(error: Error) => {
                setError(error.message);
              }}
            />
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept={tab === "post" ? "image/*" : "video/*"}
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Caption */}
        <div>
          <label className="block text-sm font-medium mb-1.5">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption…"
            rows={3}
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm resize-none outline-none focus:border-blue-400 transition-colors"
            required
          />
        </div>

        {tab === "post" && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Location (optional)</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add a location"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        )}

        {tab === "reel" && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Audio track (optional)</label>
            <input
              type="text"
              value={audioTrack}
              onChange={(e) => setAudioTrack(e.target.value)}
              placeholder="e.g. Golden Hour — JVKE"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        <button
          type="submit"
          disabled={loading || !caption.trim() || !preview}
          className="w-full py-3 rounded-xl bg-blue-500 text-white font-semibold text-sm hover:bg-blue-600 transition-colors disabled:opacity-40"
        >
          {loading ? "Sharing…" : `Share ${tab}`}
        </button>
      </form>
    </div>
  );
};

