import chai from "chai";
import chaiHttp from "chai-http";
import app from "../src/app";
import { UserModel } from "../src/models/User";
import bcrypt from "bcrypt";

const expect = chai.expect;

chai.use(chaiHttp);

describe("/auth", function () {
  let user1 = chai.request.agent(app);
  this.timeout(20000);

  describe("/signup", () => {
    describe("POST", () => {
      it("should not create a new user when missing username", async () => {
        let response = await chai
          .request(app)
          .post("/auth/signup")
          .send({ password: "password" });

        response = await chai
          .request(app)
          .post("/auth/signup")
          .send({ password: "password" });

        expect(response).to.have.status(400);
        expect(response).to.not.have.cookie("session");
      });

      it("should not create a new user when missing password", async () => {
        let response = await chai
          .request(app)
          .post("/auth/signup")
          .send({ username: "user" });

        expect(response).to.have.status(400);

        response = await chai
          .request(app)
          .post("/auth/signup")
          .send({ username: "user", password: "" });

        expect(response).to.have.status(400);
        expect(response).to.not.have.cookie("session");
      });

      it("should create a new user with both username and password", async () => {
        const response = await user1
          .post("/auth/signup")
          .send({ username: "user1", password: "password" });

        expect(response).to.have.status(201);
        expect(response).to.have.cookie("session");
      });

      it("should not create a new user with an existing username", async () => {
        let response = await chai
          .request(app)
          .post("/auth/signup")
          .send({ username: "user1", password: "newPassword" });

        expect(response).to.have.status(409);
        expect(response).to.not.have.cookie("session");

        // check that the password was not changed
        const user = await UserModel.findOne({ username: "user1" });
        expect(user).to.not.be.null;

        expect(
          await bcrypt.compare("password", user!.password),
          "'password' should be equal to user.password"
        ).to.equal(true);
        expect(
          await bcrypt.compare("newPassword", user!.password),
          "'newPassword' should not be equal to user.password"
        ).to.equal(false);
      });
    });
  });

  describe("/login", () => {
    describe("GET", () => {
      it("should not get user info when session does not exist", async () => {
        const response = await chai.request(app).get("/auth/login");

        expect(response).to.have.status(401);
        expect(response).to.not.have.cookie("session");
      });

      it("should get user info when session exists", async () => {
        const response = await user1.get("/auth/login");

        expect(response).to.have.status(200);
        expect(response.body).to.have.property("user");
        expect(response.body.user.username).to.equal("user1");
      });
    });

    describe("POST", () => {
      it("should not log in a user when missing username", async () => {
        let response = await chai
          .request(app)
          .post("/auth/login")
          .send({ password: "password" });

        expect(response).to.have.status(400);

        response = await chai
          .request(app)
          .post("/auth/login")
          .send({ username: "", password: "password" });

        expect(response).to.have.status(400);
        expect(response).to.not.have.cookie("session");
      });

      it("should not log in a user when missing password", async () => {
        let response = await chai
          .request(app)
          .post("/auth/login")
          .send({ username: "user" });

        expect(response).to.have.status(400);

        response = await chai
          .request(app)
          .post("/auth/login")
          .send({ username: "user", password: "" });

        expect(response).to.have.status(400);
        expect(response).to.not.have.cookie("session");
      });

      it("should not log in a user with an incorrect password", async () => {
        const response = await chai
          .request(app)
          .post("/auth/login")
          .send({ username: "user1", password: "wrongPassword" });

        expect(response).to.have.status(401);
        expect(response).to.not.have.cookie("session");
      });

      it("should not log in a user with an invalid username", async () => {
        const response = await chai
          .request(app)
          .post("/auth/login")
          .send({ username: "invalidUser", password: "password" });

        expect(response).to.have.status(404);
        expect(response).to.not.have.cookie("session");
      });

      it("should log in a user with a valid username and password", async () => {
        const response = await chai
          .request(app)
          .post("/auth/login")
          .send({ username: "user1", password: "password" });

        expect(response).to.have.status(200);
        expect(response).to.have.cookie("session");
      });
    });

    describe("/logout", () => {
      describe("DELETE", () => {
        it("should not log out a user when not logged in", async () => {
          const response = await chai.request(app).delete("/auth/logout");

          expect(response).to.have.status(401);
          expect(response).to.not.have.cookie("session");
        });

        it("should log out a user when logged in", async () => {
          const response = await user1.delete("/auth/logout");

          expect(response).to.have.status(200);
          expect(response).to.not.have.cookie("session");
        });
      });
    });

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
});
