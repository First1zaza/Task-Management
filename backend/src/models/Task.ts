export interface Task {
    id: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
    title: string;
    description: string;
    status: "todo" | "inprogress" | "done";
    deleted: boolean;
}

export interface TaskInput {
    title: string;
    description: string;
    status?: "todo" | "inprogress" | "done";
}