import express from "express";
import { usersRouter, showsRouter } from "./routes";

const app = express();

app.use(express.json());

app.use("/users", usersRouter);
app.use("/shows", showsRouter);

export default app;
