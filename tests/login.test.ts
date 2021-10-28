import { BeforeAll, Describe, Test } from "jest-decorator";
import request from "supertest";

import router from "@/router";

jest.mock('@/api/keycloak');

@Describe('Login endpoint')
class LoginTestGroup {
  
  @BeforeAll
  public beforeAll() {
    process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES = "some_passphrase"
  }

  @Test("should return HTTP 200 and a session cookie on valid login credentials")
  public async testValidLoginCredentials() {
    await request(router)
      .post("/api/auth/login")
      .send({username: 'test', password: 'test'})
      .set('Accept', 'application/json')
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

}
