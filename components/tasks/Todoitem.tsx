"use client";

import { useState, useTransition } from "react";
import { Todo } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  isAdmin?: boolean;
  onUpdate: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TodoItem({
  todo,
  isAdmin = false,
  onUpdate,
  onDelete,
}: TodoItemProps) {
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [isPending, startTransition] = useTransition();

  const toggleComplete = () => {
    const newState = !isCompleted;
    setIsCompleted(newState);

    startTransition(async () => {
      try {
        await onUpdate(todo.id, newState);
      } catch {
        setIsCompleted(!newState); // rollback if failed
      }
    });
  };

  const handleDelete = () => {
    startTransition(() => onDelete(todo.id));
  };

  return (
    <Card className={cn("transition-all", isPending && "opacity-70")}>
      <CardContent className="flex items-center justify-between p-4">
        <span
          className={cn("truncate text-sm md:text-base", isCompleted && "line-through text-muted-foreground")}
        >
          {todo.title}
        </span>

        
        <div className="flex items-center space-x-2">
          <Button
            variant={isCompleted ? "secondary" : "outline"}
            size="sm"
            onClick={toggleComplete}
            disabled={isPending}
          >
            {isCompleted ? (
              <XCircle className="mr-2 h-4 w-4" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            {isCompleted ? "Undo" : "Complete"}
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>

          {/* show to admin only */}
          {isAdmin && (
            <span className="ml-2 text-xs text-muted-foreground">
              UID: {todo.userId}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
