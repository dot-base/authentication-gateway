import { BeforeAll, Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";

jest.mock("@/api/keycloak");
jest.mock("@/services/Cookie");

@Describe("Login endpoint")
export default class LoginTestGroup {
  @BeforeAll
  private beforeAll() {
    process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES = "some_passphrase";
  }

  @Test(
    "should respond with HTTP status 200 and a session cookie if valid login credentials are submitted"
  )
  private async testValidLoginCredentials() {
    await request(express)
      .post("/api/auth/login")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json")
      .expect(200)
      .expect("set-cookie", /.*session=.*/);
  }

  @Test("should respond with HTTP status 403 if invalid login credentials are submitted")
  private async testInvalidLoginCredentials() {
    await request(express)
      .post("/api/auth/login")
      .send({ username: "test", password: "toast" })
      .set("Accept", "application/json")
      .expect(403);
  }

  @Test("should respond with HTTP status 403 if incomplete login credentials are submitted")
  private async testIncompleteLoginCredentials() {
    await request(express)
      .post("/api/auth/login")
      .send({ username: "test" })
      .set("Accept", "application/json")
      .expect(403);

    await request(express)
      .post("/api/auth/login")
      .send({ password: "toast" })
      .set("Accept", "application/json")
      .expect(403);
  }

  @Test("should respond with HTTP status 403 if login credentials are missing")
  private async testMissingLoginCredentials() {
    await request(express).post("/api/auth/login").expect(403);
  }
}
