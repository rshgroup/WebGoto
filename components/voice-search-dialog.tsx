"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mic, MicOff } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useEffect, useState } from "react";

interface VoiceSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResult: (transcript: string) => void;
}

export function VoiceSearchDialog({ open, onOpenChange, onResult }: VoiceSearchDialogProps) {
  const { isListening, transcript, startListening, stopListening, error, interimTranscript } = useSpeechRecognition();
  const [dots, setDots] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  useEffect(() => {
    if (transcript) {
      onResult(transcript);
      onOpenChange(false);
    }
  }, [transcript, onResult, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voice Search</DialogTitle>
          <DialogDescription>
            {error ? error : "Speak to search"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-8">
          <Button
            size="lg"
            className={`rounded-full w-24 h-24 ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? (
              <MicOff className="h-12 w-12" />
            ) : (
              <Mic className="h-12 w-12" />
            )}
          </Button>
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              {isListening ? `Listening${dots}` : "Click to start"}
            </p>
            {interimTranscript && (
              <p className="text-sm font-medium max-w-[300px] break-words">
                {interimTranscript}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}