"use client";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export default function TaskForm({ refresh, editingTask, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // Prefill form if editing
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDescription(editingTask.description || "");
    }else {
      setTitle("");
      setDescription("");
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const url = editingTask
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/updateTask/${editingTask._id}`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/createTask`;

      const method = editingTask ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        return toast.error(data.message || `Failed to register`);
      }
      toast.success(data.message);

      await refresh(); // reload tasks
      setTitle("");
      setDescription("");
      if (editingTask) onCancel(); 
    } catch (error) {
      console.error(error);
    }finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setDescription("");
     onCancel();
  }

  return (
    <Card className="shadow-card border-0 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" />
          {editingTask ? "Edit Task" : "Create New Task"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-medium border-0 bg-muted/50 focus:bg-background transition-colors"
            required
          />

          <Textarea
            placeholder="Task description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[100px] border-0 bg-muted/50 focus:bg-background transition-colors resize-none"
          />

           <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="default"
          className="flex-1"
          disabled={loading} // disable while loading
        >
          {loading
            ? "Loading..." // or you can add a spinner icon
            : editingTask
            ? "Update Task"
            : "Create Task"}
        </Button>

        {editingTask && (
          <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
        )}
      </div>
        </form>
      </CardContent>
    </Card>
  );
}
