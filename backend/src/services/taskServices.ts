import { Task } from "../models/Task";
import { TaskInput } from "../models/Task";
import { taskInputSchema } from "../schemas/taskSchema";
import { ServiceResponst } from "../models/Service";

class TaskService {

    private tasks: Task[] = [];

    // Get all tasks are active (not deleted)
    getTasks() {
        return this.tasks.filter(task => !task.deleted);
    }

    // Create a new task
    createTask(task: TaskInput): ServiceResponst {
        try {

            // Validate input
            const parsedTask = taskInputSchema.safeParse(task);

            if( !parsedTask.success ) {
                return {
                    code: 400,
                    success: false,
                    message: String(parsedTask.error.issues[0]),
                }
            }

            // Create new task
            const newTask: Task = {
                id: this.tasks.length + 1,
                created_at: new Date(),
                updated_at: new Date(),
                deleted_at: null,
                title: parsedTask.data.title,
                description: parsedTask.data.description,
                status: parsedTask.data.status || "todo",
                deleted: false
            };

            this.tasks.push(newTask);

            return {
                code: 201,
                success: true,
                data: newTask
            };
            
        } catch (error) {
            console.error("Error creating task:", error);
            return {
                code: 500,
                success: false,
                message: "Failed to create task"
            }
        }
    }

    // Update an existing task
    updateTask(id: number, task: TaskInput): ServiceResponst {

        try {

            const existingTaskIndex = this.tasks.findIndex(t => t.id === id && !t.deleted);

            if (existingTaskIndex === -1) {
                return {
                    code: 404,
                    success: false,
                    message: "Task not found"
                };
            }

            // Validate input
            const parsedTask = taskInputSchema.safeParse(task);
            if( !parsedTask.success ) {
                return {
                    code: 400,
                    success: false,
                    message: String(parsedTask.error.issues[0]),
                }
            }

            const existingTask = this.tasks[existingTaskIndex];

            const updatedTask: Task = {
                ...existingTask,
                title: parsedTask.data.title || existingTask.title,
                description: parsedTask.data.description || existingTask.description,
                status: parsedTask.data.status || existingTask.status,
                updated_at: new Date()
            };

            this.tasks[existingTaskIndex] = updatedTask;

            return {
                code: 200,
                success: true,
                data: updatedTask
            };
        } catch (error) {
            console.error("Error updating task:", error);
            return {
                code: 500,
                success: false,
                message: "Failed to update task"
            }
        }

    }

    // Delete a task (soft delete)
    deleteTask(id: number): ServiceResponst {
        try {
        
            const existingTaskIndex = this.tasks.findIndex(t => t.id === id && !t.deleted);
            if (existingTaskIndex === -1) {
                return {
                    code: 404,
                    success: false,
                    message: "Task not found"
                };
            }
            this.tasks[existingTaskIndex].deleted = true;
            this.tasks[existingTaskIndex].deleted_at = new Date();

            return {
                code: 200,
                success: true,
                message: "Task deleted successfully"
            };

        } catch (error) {
            console.error("Error deleting task:", error);
            return {
                code: 500,
                success: false,
                message: "Failed to delete task"
            }
        }
    }

}

export const taskService = new TaskService();