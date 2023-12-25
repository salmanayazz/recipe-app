import express from "express";
import { getImage } from "../controllers/images";

const router = express.Router();

router.get("/:imageName", getImage);

export default router;
