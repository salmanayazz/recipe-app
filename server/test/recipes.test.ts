import chai from "chai";
import chaiHttp from "chai-http";
import server from "../src/app";
import e from "express";

const expect = chai.expect;

chai.use(chaiHttp);

describe("recipes", function () {
  let agent = chai.request.agent(server);
  before(async function () {
    const response = await agent.post("/auth/signup").send({
      username: "test",
      password: "test",
    });
  });

  describe("GET /recipes", function () {
    it("should get all recipes on GET /recipes", async () => {
      let response = await chai.request(server).get("/recipes");

      expect(response).to.have.status(200);
      expect(response).to.be.json;
      expect(response.body).to.be.an("array");
    });
  });

  describe("POST /recipes", function () {
    it("should add a recipe on POST /recipes", function (done) {
      agent
        .post("/recipes")
        .send({
          name: "test",
          ingredients: ["1", "2"],
          directions: ["3", "4"],
        })
        .end(function (err, res) {
          expect(res).to.have.status(201);
          done();
        });
    });
  });

  describe("PUT /recipes", function () {
    it("should update a recipe on PUT /recipes", async function () {
      // add a recipe
      const addResponse = await agent.post("/recipes").send({
        name: "test",
        ingredients: ["1", "2"],
        directions: ["3", "4"],
      });
      expect(addResponse).to.have.status(201);

      // get all recipes
      const getResponse = await chai.request(server).get("/recipes");
      expect(getResponse).to.have.status(200);
      expect(getResponse).to.be.json;
      expect(getResponse.body).to.be.an("array");
      const recipes = getResponse.body;

      // update a recipe
      const updateResponse = await agent
        .put(`/recipes/${recipes[0]._id}`)
        .send({
          name: "updated",
          ingredients: ["1", "2", "3"],
          directions: ["4", "5", "6"],
        });
      expect(updateResponse).to.have.status(200);
    });
  });

  describe("DELETE /recipes", function () {
    it("should delete a recipe on DELETE /recipes", async function () {
      // add a recipe
      const addResponse = await agent.post("/recipes").send({
        name: "test",
        ingredients: ["1", "2"],
      });
      expect(addResponse).to.have.status(201);

      // get all recipes
      const getResponse = await chai.request(server).get("/recipes");
      expect(getResponse).to.have.status(200);
      expect(getResponse).to.be.json;
      expect(getResponse.body).to.be.an("array");
      const recipes = getResponse.body;

      // delete a recipe
      const deletedResponse = await agent.delete(`/recipes/${recipes[0]._id}`);
      expect(deletedResponse).to.have.status(200);
    });
  });
});
