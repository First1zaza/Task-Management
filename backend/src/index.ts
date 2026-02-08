import express from "express";
import cors from "cors";
import taskRoute from "./routes/taskRoutes";

const app = express();
const PORT = process.env.PORT || 4500;

app.use(express.json());
app.use(cors());
 
app.use("/tasks", taskRoute);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});