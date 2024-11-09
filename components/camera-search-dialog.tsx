"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, X } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { useEffect } from "react";

interface CameraSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCapture: (imageData: string) => void;
}

export function CameraSearchDialog({ open, onOpenChange, onCapture }: CameraSearchDialogProps) {
  const { videoRef, isActive, error, startCamera, stopCamera, takePhoto } = useCamera();

  useEffect(() => {
    if (open && !isActive) {
      startCamera();
    }
  }, [open, isActive, startCamera]);

  useEffect(() => {
    if (!open && isActive) {
      stopCamera();
    }
  }, [open, isActive, stopCamera]);

  const handleCapture = () => {
    const photo = takePhoto();
    if (photo) {
      onCapture(photo);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Camera Search</DialogTitle>
          <DialogDescription>
            {error ? error : "Take a photo to search"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              size="lg"
              onClick={handleCapture}
              disabled={!isActive}
            >
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}