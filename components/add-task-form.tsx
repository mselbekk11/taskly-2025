"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "convex/react";

interface AddTaskFormProps {
  onSubmit: (task: { title: string; description?: string }) => void;
  onCancel: () => void;
}

export default function AddTaskForm({ onSubmit, onCancel }: AddTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const addTask = useMutation("tasks:addTask");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await addTask({ title: title.trim(), description: description.trim() });
      setTitle("");
      setDescription("");
      onCancel();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <Input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          className="focus-visible:ring-1"
        />
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Task</Button>
      </div>
    </form>
  );
}
