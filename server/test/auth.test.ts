// const chai = require("chai");
// const chaiHttp = require("chai-http");
// const app = require("../src/app");
// const expect = chai.expect;

import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/app";

const expect = chai.expect;

chai.use(chaiHttp);

describe("Authentication Routes", () => {
  describe("POST /signup", () => {
    it("should create a new user", async () => {
      const response = await chai
        .request(app)
        .post("/auth/signup")
        .send({ username: "user", password: "password" });

      expect(response).to.have.status(201);
      expect(response).to.have.cookie("session");
    });
  });

  describe("POST /login", () => {
    it("should log in an existing user", async () => {
      await chai
        .request(app)
        .post("/auth/signup")
        .send({ username: "user1", password: "password" });

      const response = await chai
        .request(app)
        .post("/auth/login")
        .send({ username: "user1", password: "password" });

      expect(response).to.have.status(200);
      expect(response).to.have.cookie("session");
    });
  });

  describe("DELETE /logout", () => {
    it("should log out a logged-in user", async () => {
      const agent = chai.request.agent(app); // agent to maintain session

      // create account
      await agent
        .post("/auth/signup")
        .send({ username: "user2", password: "password" });

      const response = await agent.delete("/auth/logout");

      expect(response).to.have.status(200);
      expect(response).to.not.have.cookie("session");
    });
  });
});
