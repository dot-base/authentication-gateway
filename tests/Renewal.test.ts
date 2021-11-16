import { BeforeAll, Describe, Test } from "jest-decorator";
import request from "supertest";

import router from "@/router";
import LoginTestGroup from "./Login.test";

jest.mock('@/api/keycloak');
jest.mock('@/services/Cookie');

@Describe('Renewal endpoint')
class RenewalTestGroup {
  
  @BeforeAll
  public async beforeAll() {
    process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES = "some_passphrase"
  }

  @Test("should respond with HTTP status 200 and a session cookie if a valid session cookie is submitted")
  public async testRenewValidSessionCookie() {
    const loginResponse = await LoginTestGroup.validLoginRequest;
    const cookies = loginResponse.headers['set-cookie'][0].split(',').map((item: string) => item.split(';')[0]);
    const cookie = cookies.join(';');

    await request(router)
      .post("/api/auth/renew")
      .set('Cookie', cookie)
      .expect(200)
      .expect('set-cookie', /.*session=.*/)
  }

  @Test("should respond with HTTP status 403 if an invalid session cookie is submitted")
  public async testInvalidSessionCookie() {
    await request(router)
      .post("/api/auth/renew")
      .set('Cookie', 'some-invalid-cookie-value')
      .expect(403)
  }

  @Test("should respond with HTTP status 403 if the session cookie is missing")
  public async testMissingSessionCookie() {
    await request(router)
      .post("/api/auth/renew")
      .expect(403)
  }

}
