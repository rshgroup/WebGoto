"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Search } from "lucide-react";
import Link from "next/link";
import { VoiceSearchDialog } from "@/components/voice-search-dialog";
import { CameraSearchDialog } from "@/components/camera-search-dialog";
import { ImageUploadDialog } from "@/components/image-upload-dialog";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
        <img
          src="https://i.im.ge/2024/11/08/kvnDkx.WebGoto.png"
          alt="WebGoto"
          className="h-24 w-auto"
        />

        <form action="/search" className="w-full">
          <div className="relative">
            <Input
              name="q"
              className="pl-10 pr-28 h-12 rounded-full border-2 hover:border-gray-300 focus-visible:border-blue-500"
              placeholder="Explore the web—start your search here..."
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <VoiceSearchButton />
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Button type="submit">Goto</Button>
          </div>
        </form>
      </div>

      <footer className="fixed bottom-0 left-0 right-0 bg-muted/50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex gap-6">
            {/* Updated Link to About Page */}
            <Link href="https://rshabout.netlify.app/" className="text-sm text-muted-foreground hover:underline">
              About
            </Link>
          </div>
        </div>
        
      </footer>
      
    </main>
  );
}

function VoiceSearchButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button 
        type="button" 
        size="icon" 
        variant="ghost"
        onClick={() => setOpen(true)}
      >
        <Mic className="h-5 w-5" />
      </Button>
      <VoiceSearchDialog
        open={open}
        onOpenChange={setOpen}
        onResult={(transcript) => {
          window.location.href = `/search?q=${encodeURIComponent(transcript)}`;
        }}
      />
    </>
  );
}
