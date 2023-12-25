import express from "express";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { UserModel, User } from "../models/User";
import mongoose from "mongoose";

const router = express.Router();

interface UserRequest extends Request {
  user?: User;
}

async function getUser(req: UserRequest, res: Response, next: NextFunction) {
  try {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      return res.status(400).send("Missing username or password");
    }

    const user = await UserModel.findOne({ username: username });

    req.user = user!;

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
}

router.post(
  "/signup",
  getUser,
  async function (req: UserRequest, res: Response) {
    try {
      const user = req.user;
      const username = req.body.username;
      const password = req.body.password;

      if (user) {
        return res.status(409).send("User already exists");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await UserModel.create({
        username: username,
        password: hashedPassword,
      });

      req.session.username = username;

      return res.status(201).send("User created");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal server error");
    }
  }
);

router.post(
  "/login",
  getUser,
  async function (req: UserRequest, res: Response) {
    try {
      const user = req.user;
      const username = req.body.username;
      const password = req.body.password;

      if (!user) {
        return res.status(404).send("User does not exist");
      }

      if (!(await bcrypt.compare(password, user.password))) {
        return res.status(400).send("Incorrect password");
      }

      req.session.username = username;

      return res.status(200).json({ user: { username: req.session.username } });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Internal server error");
    }
  }
);

router.get("/login", async function (req: Request, res: Response) {
  try {
    if (req.session.username) {
      return res.status(200).json({ user: { username: req.session.username } });
    } else {
      return res.status(401).send("Unauthorized");
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Internal server error");
  }
});

router.delete("/logout", function (req: Request, res: Response) {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal server error");
    }
    return res.status(200).send("Successfully logged out");
  });
});

export default router;
