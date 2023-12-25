import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";

import authRouter from "./routes/auth";
import recipesRouter from "./routes/recipes";
import imagesRouter from "./routes/images";

dotenv.config();

const app = express();

export default app;

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

// expect test config to connect to test MONGODB_URI
if (process.env.NODE_ENV !== "test") {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not set");
  }
  mongoose.connect(process.env.MONGODB_URI);
  console.log(process.env.MONGODB_URI);
  mongoose.connection.on("open", function (ref) {
    console.log("Connected to mongo server.");
  });
}

declare module "express-session" {
  interface SessionData {
    username?: string;
  }
}

app.use(
  session({
    name: "session",
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/auth", authRouter);
app.use("/recipes", recipesRouter);
app.use("/images", imagesRouter);

app.use(function (req: Request, res: Response, next: NextFunction) {
  res.status(404).send("Not found");
});

export { app };
