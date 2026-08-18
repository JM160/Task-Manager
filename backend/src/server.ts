import express from "express";
import taskRoutes from "./routes/taskRoutes";

import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});