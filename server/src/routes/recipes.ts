import express, { NextFunction, Request, Response } from "express";
import { Recipe, RecipeModel } from "../models/Recipe";
import {
  uploadImage,
  deleteImage,
  imageUploadMulter,
  ImageRequest,
} from "../controllers/images";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

function checkAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.username) {
    return next();
  }

  res.status(401).send("Unauthorized");
}

router.get("/", async function (req: Request, res: Response) {
  try {
    // build the query based on search parameters
    const query: { [key: string]: any } = {};

    if (req.query.username) {
      query.username = req.query.username;
    }

    if (req.query.recipeName) {
      // substring search
      query.name = {
        $regex: req.query.recipeName,
        $options: "i",
      };
    }
    if (req.query.ingredients) {
      query.ingredients = req.query.ingredients;
    }

    res.json(await RecipeModel.find(query).limit(24));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.use(
  "/",
  checkAuthenticated,
  imageUploadMulter.single("image"),
  function (req: Request, res: Response, next) {
    try {
      // prevent user from setting the _id or image name
      req.body._id = undefined;
      req.body.imageName = undefined;

      // parse the json stringified values from req.body
      req.body = Object.fromEntries(
        Object.entries(req.body).map(([key, value]) => {
          try {
            return [key, JSON.parse(value as string)];
          } catch (error) {
            // if parsing fails, keep the original value
            return [key, value];
          }
        })
      );

      next();
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  }
);

router.post("/", async function (req: ImageRequest, res: Response) {
  try {
    const recipe = new RecipeModel({
      ...req.body,
      username: req.session.username,
    });

    // upload the image
    if (req.file) {
      if (!(await uploadImage(req, res))) {
        return;
      }

      // save the image name
      recipe.imageName = req.imageName;
    }

    await recipe.save();
    res.status(201).send("Recipe created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.put("/:recipeID", async function (req: ImageRequest, res: Response) {
  try {
    const recipe = await RecipeModel.findByIdAndUpdate(
      {
        _id: req.params.recipeID,
        username: req.session.username,
      },
      {
        ...req.body,
      },
      {
        new: true,
      }
    );

    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }

    if (recipe.imageName && req.file) {
      // delete the old image
      req.params.imageName = recipe.imageName;
      if (!(await deleteImage(req, res))) {
        return;
      }

      // upload the new image
      if (!(await uploadImage(req, res))) {
        return;
      }
      recipe.imageName = req.imageName;
    } else if (req.file) {
      // if there is no old image
      if (!(await uploadImage(req, res))) {
        return;
      }
      recipe.imageName = req.imageName;
    } else if (recipe.imageName && !req.file) {
      // if user removes the image
      req.params.imageName = recipe.imageName;
      if (!(await deleteImage(req, res))) {
        return;
      }
      recipe.imageName = undefined;
    }

    await recipe.save();
    res.status(200).send("Recipe updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.delete("/:recipeID", async function (req: Request, res: Response) {
  try {
    const recipe: Recipe | null = await RecipeModel.findOne({
      _id: req.params.recipeID,
      username: req.session.username,
    });

    if (!recipe) {
      return res.status(404).send("Recipe not found");
    }

    if (recipe.imageName) {
      // delete the image
      req.params.imageName = recipe.imageName;
      if (!(await deleteImage(req, res))) {
        return;
      }
    }

    await RecipeModel.deleteOne({
      _id: recipe._id,
    });

    res.status(200).send("Recipe deleted successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

export default router;
