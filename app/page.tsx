"use client";

import { useState, useSyncExternalStore } from "react";
import AddTask from "../components/AddTask";
import TaskList from "../components/TaskList";
import Filter from "../components/Filter";
import Counter from "../components/Counter";

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

type FilterValue = "all" | "pending" | "completed";

const STORAGE_KEY = "tasks";
const CHANGE_EVENT = "tasks-change";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function getSnapshot() {
  return localStorage.getItem(STORAGE_KEY) ?? "[]";
}

function getServerSnapshot() {
  return "[]";
}

function isTask(value: unknown): value is Task {
  if (typeof value !== "object" || value === null) return false;

  const task = value as Record<string, unknown>;
  return (
    typeof task.id === "number" &&
    typeof task.text === "string" &&
    typeof task.completed === "boolean"
  );
}

function readTasks(raw: string): Task[] {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTask);
  } catch {
    return [];
  }
}

function writeTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export default function Home() {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const tasks = readTasks(raw);
  const [filter, setFilter] = useState<FilterValue>("all");

  function addTask(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const id = tasks.reduce((max, task) => Math.max(max, task.id), 0) + 1;

    writeTasks([
      ...tasks,
      { id, text: trimmed, completed: false },
    ]);
  }

  function toggleTask(id: number) {
    writeTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  function deleteTask(id: number) {
    writeTasks(tasks.filter((task) => task.id !== id));
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  return (
    <main className="container">
      <h1>Lista de Tarefas</h1>

      <AddTask addTask={addTask} />

      <Counter count={tasks.length} />

      <Filter filter={filter} setFilter={setFilter} />

      <TaskList
        tasks={filteredTasks}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
      />
    </main>
  );
}
