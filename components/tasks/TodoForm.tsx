"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import {motion} from "framer-motion";

interface TodoFormProps {
  onSubmit: (title: string) => Promise<void> | void;
  placeholder?: string; 
  buttonLabel?: string;
  compact?: boolean;
}

export function TodoForm({ 
  onSubmit,
  placeholder = "Enter a new todo",
  buttonLabel = "Add",
  compact = false,
}: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    
    startTransition(async() => {
      try {
        await onSubmit(trimmed);
        setTitle("")
      } catch (error) {
        console.error("Todo creation is failed: ", error)
      }
    })
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className={cn("flex items-center space-x-2 mb-4", compact && "space-x-1 mb-2")}
      initial={{opacity: 0, y:10}}
      animate={{opacity: 1, y:0}}
      transition={{duration: 0.2}}
    >
      <Input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={placeholder}
        disabled={isPending}
        className={cn("flex-grow", compact && "h-8 text-sm")}
        required
      />

      <Button type="submit" variant="default" disabled={!title.trim() || isPending} size={compact ?"sm":"default"}>
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Adding... 
          </>
        ):(
          <>
            <Plus className="mr-2 h-4 w-4"/>
            {buttonLabel}
          </>
        )}
      </Button>
    </motion.form>
  );
}