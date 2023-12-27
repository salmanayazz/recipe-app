import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/app";
import mongoose from "mongoose";
import { Recipe } from "../src/models/Recipe";

const expect = chai.expect;
chai.use(chaiHttp);

describe("/recipes", function () {
  let user1 = chai.request.agent(app);
  let user2 = chai.request.agent(app);
  before(async function () {
    let response = await user1.post("/auth/signup").send({
      username: "test1",
      password: "test1",
    });

    expect(response).to.have.status(201);
    expect(response).to.have.cookie("session");

    response = await user2.post("/auth/signup").send({
      username: "test2",
      password: "test2",
    });

    expect(response).to.have.status(201);
    expect(response).to.have.cookie("session");
  });

  after(async function () {
    mongoose.connection.dropDatabase();
  });

  let recipes: Recipe[] = [];

  describe("POST", function () {
    it("should not add a recipe when not authenticated", async function () {
      let response = await chai
        .request(app)
        .post("/recipes")
        .send({
          name: "test",
          ingredients: ["1", "2"],
          directions: ["3", "4"],
        });

      expect(response).to.have.status(401);
    });

    it("should not get new recipe", async () => {
      let response = await chai.request(app).get("/recipes");

      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(0);
    });

    it("should add a recipe when authenticated", async function () {
      let response = await user1.post("/recipes").send({
        _id: "test",
        imageName: "test",
        name: "test",
        ingredients: ["1", "2"],
        directions: ["3", "4"],
      });

      expect(response).to.have.status(201);
    });

    it("should get new recipe", async () => {
      let response = await chai.request(app).get("/recipes");

      recipes = response.body;

      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(1);
      expect(response.body[0]).to.have.property("_id");
      expect(response.body[0]._id).to.not.equal("test");
      expect(response.body[0].imageName).to.not.equal("test");
      expect(response.body[0].name).to.equal("test");
      expect(response.body[0].ingredients).to.deep.equal(["1", "2"]);
      expect(response.body[0].directions).to.deep.equal(["3", "4"]);
    });
  });

  describe("PUT", function () {
    it("should not update a recipe when not authenticated", async function () {
      let response = await chai
        .request(app)
        .put("/recipes")
        .send({
          name: "updated",
          ingredients: ["5", "6", "7"],
          directions: ["8", "9", "10"],
        });

      expect(response).to.have.status(401);
    });

    it("should not get updated recipe after not authenticated", async () => {
      let response = await chai.request(app).get("/recipes");

      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(1);
      expect(response.body[0].name).to.equal("test");
      expect(response.body[0].ingredients).to.deep.equal(["1", "2"]);
      expect(response.body[0].directions).to.deep.equal(["3", "4"]);
    });

    it("should not update a recipe when authenticated as another user", async function () {
      const response = await user2.put(`/recipes/${recipes[0]._id}`).send({
        name: "updated",
        ingredients: ["5", "6", "7"],
        directions: ["8", "9", "10"],
      });

      expect(response).to.have.status(404);
    });

    it("should not get updated recipe after authenticated as another user", async () => {
      let response = await chai.request(app).get("/recipes");

      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(1);
      expect(response.body[0].name).to.equal("test");
      expect(response.body[0].ingredients).to.deep.equal(["1", "2"]);
      expect(response.body[0].directions).to.deep.equal(["3", "4"]);
    });

    it("should update a recipe when authenticated as the owner", async function () {
      const response = await user1.put(`/recipes/${recipes[0]._id}`).send({
        _id: "test",
        imageName: "test",
        name: "updated",
        ingredients: ["5", "6", "7"],
        directions: ["8", "9", "10"],
      });

      expect(response).to.have.status(200);
    });

    it("should get updated recipe when authenticaed as the owner", async () => {
      let response = await chai.request(app).get("/recipes");

      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(1);
      expect(response.body[0]._id).to.not.equal("test");
      expect(response.body[0].imageName).to.not.equal("test");
      expect(response.body[0].name).to.equal("updated");
      expect(response.body[0].ingredients).to.deep.equal(["5", "6", "7"]);
      expect(response.body[0].directions).to.deep.equal(["8", "9", "10"]);
    });
  });

  describe("DELETE", function () {
    it("should not delete a recipe when not authenticated", async function () {
      let response = await chai
        .request(app)
        .delete(`/recipes/${recipes[0]._id}`);

      expect(response).to.have.status(401);
    });

    it("should get recipe after trying to delete when not authenticated", async () => {
      let response = await chai.request(app).get("/recipes");

      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(1);
      expect(response.body[0].name).to.equal("updated");
      expect(response.body[0].ingredients).to.deep.equal(["5", "6", "7"]);
      expect(response.body[0].directions).to.deep.equal(["8", "9", "10"]);
    });

    it("should not delete a recipe when authenticated as another user", async function () {
      const response = await user2.delete(`/recipes/${recipes[0]._id}`);

      expect(response).to.have.status(404);
    });

    it("should get recipe after trying to delete when authenticated as another user", async () => {
      let response = await chai.request(app).get("/recipes");

      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(1);
      expect(response.body[0].name).to.equal("updated");
      expect(response.body[0].ingredients).to.deep.equal(["5", "6", "7"]);
      expect(response.body[0].directions).to.deep.equal(["8", "9", "10"]);
    });

    it("should delete a recipe when authenticated as the owner", async function () {
      const response = await user1.delete(`/recipes/${recipes[0]._id}`);

      expect(response).to.have.status(200);
    });

    it("should not get recipe after deleting when authenticated as the owner", async () => {
      let response = await chai.request(app).get("/recipes");

      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an("array");
      expect(response.body.length).to.equal(0);
    });
  });
});
