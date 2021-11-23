import { BeforeAll, Describe, Test } from "jest-decorator";
import request from "supertest";

import router from "@/router";

jest.mock("@/api/keycloak");
jest.mock("@/services/Cookie");

@Describe("Renewal endpoint")
export default class RenewalTestGroup {
  @BeforeAll
  private async beforeAll() {
    process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES = "some_passphrase";
  }

  @Test(
    "should respond with HTTP status 200 and a session cookie if a valid session cookie is submitted"
  )
  private async testRenewValidSessionCookie() {
    const loginResponse = await request(router)
      .post("/api/auth/login")
      .send({ username: "test", password: "test" })
      .set("Accept", "application/json");

    const cookies = loginResponse.headers["set-cookie"][0]
      .split(",")
      .map((item: string) => item.split(";")[0]);
    const cookie = cookies.join(";");

    await request(router)
      .post("/api/auth/renew")
      .set("Cookie", cookie)
      .expect(200)
      .expect("set-cookie", /.*session=.*/);
  }

  @Test("should respond with HTTP status 403 if an invalid session cookie is submitted")
  private async testInvalidSessionCookie() {
    await request(router)
      .post("/api/auth/renew")
      .set("Cookie", "some-invalid-cookie-value")
      .expect(403);
  }

  @Test("should respond with HTTP status 403 if the session cookie is missing")
  private async testMissingSessionCookie() {
    await request(router).post("/api/auth/renew").expect(403);
  }
}
