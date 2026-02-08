import express from "express";
import { taskService } from "../services/taskServices";

const taskRoute = express.Router();

taskRoute.get("/", (req, res) => {
    const tasks = taskService.getTasks();
    res.json({
        success: true,
        data: tasks
    });
});

taskRoute.post("/", (req, res) => {
    const taskInput = req.body;
    const result = taskService.createTask(taskInput);
    if (result.success === false) {
        res.status(result.code).json({
            success: false,
            message: result.message
        });
    } else {
        res.status(201).json({
            success: true,
            data: result.data
        });
    }
})

taskRoute.put("/:id", (req, res) => {
    
    const { id } = req.params;
    const taskInput = req.body;

    const result = taskService.updateTask(Number(id), taskInput);

    if (result.success === false) {
        res.status(result.code).json({
            success: false,
            message: result.message
        });
    } else {
        res.status(200).json({
            success: true,
            data: result.data
        });
    }
})

taskRoute.delete("/:id", (req, res) => {
    const { id } = req.params;
    const result = taskService.deleteTask(Number(id));

    if (result.success === false) {
        res.status(result.code).json({
            success: false,
            message: result.message
        });
    } else {
        res.status(200).json({
            success: true,
            message: result.message
        });
    }
})

export default taskRoute;