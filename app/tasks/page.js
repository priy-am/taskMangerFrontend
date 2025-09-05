'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null); // store task being edited
  const router = useRouter();

  // Fetch tasks from backend
  const fetchTasks = async () => {
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem('token'); 
    if (!token) {
      router.push('/auth/login');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/allTask`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch tasks');

      const data = await res.json();
      console.log('Tasks from frontend:', data);
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []); // empty dependency → runs once on mount

  // Toggle task completed/pending
  const toggleStatus = async (id, completed) => {
    const token = localStorage.getItem('token'); 
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/updateTask/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed: !completed }),
      });
      fetchTasks(); // refresh tasks
    } catch (err) {
      console.error(err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    const token = localStorage.getItem('token'); 
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tasks/deleteTask/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // refresh tasks
    } catch (err) {
      console.error(err);
    }
  };

  // Edit task
  const handleEdit = (task) => {
    setEditingTask(task);
  };

  const onCancelEdit = () => {
    setEditingTask(null);
    
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Tasks</h1>

      {/* Task Form */}
      <TaskForm 
        refresh={fetchTasks} 
        editingTask={editingTask} 
        onCancel={() => onCancelEdit()} 
      />

      {/* Task List */}
      <TaskList 
        tasks={tasks} 
        refresh={fetchTasks} 
        onEdit={handleEdit} 
        toggleStatus={toggleStatus}  
        deleteTask={deleteTask} 
      />
    </div>
  );
}
