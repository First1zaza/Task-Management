import { create } from "zustand";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: "todo" | "inprogress" | "done";
}

interface TaskStore {
    tasks: Task[];
    newTask: Task[];
    setTasks: (tasks: Task[]) => void;
    setNewTask: (tasks: Task[]) => void;
    addNewTask: (status: "todo" | "inprogress" | "done") => void;
    updateTask: (id: number, field: string, value: string) => void;
    updateNewTask: (id: number, field: string, value: string) => void;
    removeNewTask: (id: number) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
    tasks: [],
    newTask: [],

    setTasks: (tasks: Task[]) => set({ tasks }),

    setNewTask: (tasks: Task[]) => set({ newTask: tasks }),

    addNewTask: (status: "todo" | "inprogress" | "done") =>
        set((state) => ({
            newTask: [
                ...state.newTask,
                {
                    id: Date.now(),
                    title: "New Task",
                    description: "Task Description",
                    status,
                },
            ],
        })),

    updateTask: (id: number, field: string, value: string) =>
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === id ? { ...task, [field]: value } : task
            ),
        })),

    updateNewTask: (id: number, field: string, value: string) =>
        set((state) => ({
            newTask: state.newTask.map((task) =>
                task.id === id ? { ...task, [field]: value } : task
            ),
        })),

    removeNewTask: (id: number) =>
        set((state) => ({
            newTask: state.newTask.filter((task) => task.id !== id),
        })),
}));
