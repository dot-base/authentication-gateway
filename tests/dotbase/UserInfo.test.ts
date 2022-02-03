import { Describe, Test } from "jest-decorator";
import request from "supertest";

import express from "@/express";

jest.mock("@/api/Keycloak");

@Describe("UserInfo endpoint for a dotbase user")
export default class UserInfoTestGroup {
  @Test(
    "should respond with HTTP status 200 and a userinfo json if a valid session cookie is submitted"
  )
  private async testUserInfoValidSessionCookie() {
    const loginResponse = await request(express)
      .post("/api/auth/login/dotbase")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");

    const cookie = loginResponse.headers["set-cookie"][0];

    const res = await request(express).get("/api/auth/userinfo").set("Cookie", cookie).expect(200);
    expect(res.body).toHaveProperty("preferred_username");
  }

  @Test("should respond with HTTP status 403 if an invalid session cookie is submitted")
  private async testUserInfoInvalidSessionCookie() {
    await request(express)
      .get("/api/auth/userinfo")
      .set("Cookie", "some-invalid-cookie-value")
      .expect(403);
  }

  @Test("should respond with HTTP status 403 if the session cookie is missing")
  private async testUserInfoMissingSessionCookie() {
    await request(express).get("/api/auth/userinfo").expect(403);
  }
}
