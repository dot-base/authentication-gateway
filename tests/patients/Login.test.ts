import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";

jest.mock("@/api/Keycloak");

@Describe("Login endpoint for a patient user")
export default class LoginTestGroup {
  @Test(
    "should respond with HTTP status 200 and a session cookie if valid login credentials are submitted"
  )
  private async testValidLoginCredentials() {
    await request(express)
      .post("/api/auth/login/patients")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json")
      .expect(200)
      .expect("set-cookie", /.*session=.*/);
  }

  @Test("should respond with HTTP status 401 if invalid login credentials are submitted")
  private async testInvalidLoginCredentials() {
    await request(express)
      .post("/api/auth/login/patients")
      .send({ username: "test", password: "toast" })
      .set("Accept", "application/json")
      .expect(401);
  }

  @Test("should respond with HTTP status 400 if incomplete login credentials are submitted")
  private async testIncompleteLoginCredentials() {
    await request(express)
      .post("/api/auth/login/patients")
      .send({ username: "test" })
      .set("Accept", "application/json")
      .expect(400);

    await request(express)
      .post("/api/auth/login/patients")
      .send({ password: "toast" })
      .set("Accept", "application/json")
      .expect(400);
  }

  @Test("should respond with HTTP status 400 if login credentials are missing")
  private async testMissingLoginCredentials() {
    await request(express).post("/api/auth/login/patients").expect(400);
  }
}
