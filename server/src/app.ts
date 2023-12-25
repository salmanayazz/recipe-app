import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import dotenv from "dotenv";

import indexRouter from "./routes/index";
import authRouter from "./routes/auth";
import recipesRouter from "./routes/recipes";
import imagesRouter from "./routes/images";

dotenv.config();

const app = express();

export default app;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

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

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/recipes", recipesRouter);
app.use("/images", imagesRouter);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
