"use client";

import { Mic, Search, Camera, Settings, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { useState } from "react";
import { VoiceSearchDialog } from "./voice-search-dialog";
import { CameraSearchDialog } from "./camera-search-dialog";
import { ImageUploadDialog } from "./image-upload-dialog";
import { ThemeToggle } from "./theme-toggle";

export function SearchHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  const [query, setQuery] = useState(searchTerm);
  const [voiceSearchOpen, setVoiceSearchOpen] = useState(false);
  const [cameraSearchOpen, setCameraSearchOpen] = useState(false);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);

  const tabs = [
    { value: "web", label: "Web", path: "/search" },
    { value: "images", label: "Images", path: "/search/images" },
    { value: "videos", label: "Videos", path: "/search/videos" },
    { value: "news", label: "News", path: "/search/news" },
  ];

  const getCurrentTab = () => {
    if (pathname.includes("/images")) return "images";
    if (pathname.includes("/videos")) return "videos";
    if (pathname.includes("/news")) return "news";
    return "web";
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`${pathname}?q=${encodeURIComponent(query)}`);
  };

  const handleTabChange = (value: string) => {
    const tab = tabs.find((t) => t.value === value);
    if (tab) {
      router.push(`${tab.path}?q=${encodeURIComponent(query)}`);
    }
  };

  const handleVoiceResult = (transcript: string) => {
    setQuery(transcript);
    router.push(`${pathname}?q=${encodeURIComponent(transcript)}`);
  };



  return (
    <header className="sticky top-0 bg-background border-b z-50">
      <div className="flex items-center gap-4 p-4 flex-wrap sm:flex-nowrap">
        <Link href="/" className="shrink-0">
          <img
            src="https://i.im.ge/2024/11/08/kvnDkx.WebGoto.png"
            alt="WebGoto"
            className="h-8"
          />
        </Link>

        <form onSubmit={handleSearch} className="flex-1 min-w-0 max-w-2xl order-last sm:order-none w-full sm:w-auto">
          <div className="relative">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-20"
              placeholder="Explore the web—start your search here..."
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={() => setVoiceSearchOpen(true)}
              >
                <Mic className="h-4 w-4" />
              </Button>
             
              
              <Button type="submit" size="icon" variant="ghost">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          
        </div>
      </div>

      <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="px-4">
        <TabsList className="w-full sm:w-auto justify-start overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="whitespace-nowrap">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <VoiceSearchDialog
        open={voiceSearchOpen}
        onOpenChange={setVoiceSearchOpen}
        onResult={handleVoiceResult}
      />



      
    </header>
  );
}