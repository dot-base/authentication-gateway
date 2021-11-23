import { BeforeAll, Describe, Test } from "jest-decorator";
import request from "supertest";

import router from "@/express";

jest.mock("@/api/keycloak");
jest.mock("@/services/Cookie");

@Describe("Validation endpoint")
export default class ValidationTestGroup {
  @BeforeAll
  private async beforeAll() {
    process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES = "some_passphrase";
  }

  @Test("should respond with HTTP status 200 if a valid session cookie is submitted")
  private async testValidSessionCookie() {
    const loginResponse = await request(router)
      .post("/api/auth/login")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");

    const cookie = loginResponse.headers["set-cookie"][0];

    await request(router).post("/api/auth/validate").set("Cookie", cookie).expect(200);
  }

  @Test("should respond with HTTP status 403 if an invalid session cookie is submitted")
  private async testInvalidSessionCookie() {
    await request(router)
      .post("/api/auth/validate")
      .set("Cookie", "some-invalid-cookie-value")
      .expect(403);
  }

  @Test("should respond with HTTP status 403 if the session cookie is missing")
  private async testMissingSessionCookie() {
    await request(router).post("/api/auth/validate").expect(403);
  }
}
