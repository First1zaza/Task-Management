import z from "zod"

// Schema for creating a new task
export const taskInputSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["todo", "inprogress", "done"]).optional()
})
