import { BeforeAll, Describe, Test } from "jest-decorator";
import request from "supertest";

import router from "@/router";

jest.mock('@/api/keycloak');

@Describe('Login endpoint')
export default class LoginTestGroup {

  public static get validLoginRequest(): request.Test {
    return request(router)
      .post("/api/auth/login")
      .send({username: 'test', password: 'test'})
      .set('Accept', 'application/json')
  }
  
  @BeforeAll
  public beforeAll() {
    process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES = "some_passphrase"
  }

  @Test("should return HTTP 200 and a session cookie on valid login credentials")
  public async testValidLoginCredentials() {
    await LoginTestGroup.validLoginRequest
      .expect(200)
      .expect('set-cookie', /.*session=.*/)
  }

  @Test("should return HTTP 403 on invalid login credentials")
  public async testInvalidLoginCredentials() {
    await request(router)
      .post("/api/auth/login")
      .send({username: 'test', password: 'toast'})
      .set('Accept', 'application/json')
      .expect(403)
  }

  @Test("should return HTTP 403 on missing login credentials")
  public async testMissingLoginCredentials() {
    await request(router)
      .post("/api/auth/login")
      .expect(403)
  }

}
