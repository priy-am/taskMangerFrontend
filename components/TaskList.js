'use client';
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock, Edit, Trash2, Calendar } from "lucide-react";

export default function TaskList({ tasks, refresh, onEdit }) {
  const [filter, setFilter] = useState("all");
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const filteredTasks = tasks.filter(task =>
    filter === "all" || (task.completed ? "completed" : "pending") === filter
  );

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  const toggleStatus = async (_id, completed) => {
    if (!token || !_id) return;
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/updateTask/${_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ completed: !completed }),
    });
    refresh();
  };

  const deleteTask = async (_id) => {
    if (!token || !_id) return;
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/deleteTask/${_id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    refresh();
  };

  const filterButtons = [
    { key: "all", label: "All Tasks", count: tasks.length },
    { key: "pending", label: "Pending", count: tasks.filter(t => !t.completed).length },
    { key: "completed", label: "Completed", count: tasks.filter(t => t.completed).length },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ key, label, count }) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            onClick={() => setFilter(key)}
            className="flex items-center gap-2"
          >
            {label}
            <Badge variant="secondary" className="text-xs">
              {count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Tasks */}
      {filteredTasks.length === 0 ? (
        <Card className="shadow-card border-0 bg-card/50">
          <CardContent className="py-12 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">
              {filter === "all" ? "No tasks yet" : `No ${filter} tasks`}
            </h3>
            <p className="text-sm text-muted-foreground mt-2">
              {filter === "all" 
                ? "Create your first task to get started!" 
                : `You don't have any ${filter} tasks right now.`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const StatusIcon = task.completed ? CheckCircle : Circle;

            return (
              <Card key={task._id} className={`group shadow-card border-0 bg-card/50 backdrop-blur-sm transition-all hover:shadow-lg ${task.completed ? "opacity-75" : ""}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    {/* Status Toggle Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleStatus(task._id, task.completed)}
                      className={`p-2 hover:bg-transparent ${task.completed ? "text-green-600" : "text-gray-500"}`}
                    >
                      <StatusIcon className="w-5 h-5" />
                    </Button>

                    <div className="flex-1 min-w-0">
                      <h3 className={`font-medium text-lg ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {task.dueDate && (
                        <div className={`flex items-center gap-1 text-xs text-muted-foreground ${isOverdue(task.dueDate) && !task.completed ? "text-destructive" : ""}`}>
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(task.dueDate).toLocaleDateString()}
                            {isOverdue(task.dueDate) && !task.completed && " (Overdue)"}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(task)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteTask(task._id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
