// src/components/shared/ai-input-field.tsx
"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bot, Loader2, CornerDownLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { processAiInput } from "@/actions/ai-actions";
import { useSettings } from "@/contexts/settings-context";

interface AiInputFieldProps {
  onAiResult: (result: string | number, expression: string) => void;
  placeholder?: string;
}

export function AiInputField({ onAiResult, placeholder = "Ask AI: e.g., '15% of 200' or '10kg to lbs'" }: AiInputFieldProps) {
  const [inputValue, setInputValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const { formatNumber } = useSettings();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim()) return;

    startTransition(async () => {
      try {
        const result = await processAiInput(inputValue);
        if (result.error) {
          toast({
            variant: "destructive",
            title: "AI Error",
            description: result.error,
          });
          onAiResult("Error", inputValue);
        } else if (result.evaluatedResult !== undefined) {
          onAiResult(result.evaluatedResult, result.calculation || inputValue);
          toast({
            title: "AI Calculation Complete",
            description: `${result.calculation || inputValue} = ${formatNumber(result.evaluatedResult)}`,
          });
        } else {
           toast({
            variant: "destructive",
            title: "AI Error",
            description: "Could not evaluate the expression.",
          });
          onAiResult("Error", inputValue);
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "AI Processing Error",
          description: "An unexpected error occurred.",
        });
        onAiResult("Error", inputValue);
      }
      setInputValue(""); // Clear input after submission
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
      <div className="relative flex-grow">
        <Bot className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-20"
          disabled={isPending}
        />
         <Button 
          type="submit" 
          size="icon" 
          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
          variant="ghost"
          disabled={isPending || !inputValue.trim()}
          aria-label="Submit AI query"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CornerDownLeft className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
}
