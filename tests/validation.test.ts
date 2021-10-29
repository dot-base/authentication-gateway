import { BeforeAll, Describe, Test } from "jest-decorator";
import request from "supertest";

import router from "@/router";
import LoginTestGroup from "./login.test";

jest.mock('@/api/keycloak');

@Describe('Validation endpoint')
class ValidationTestGroup {

  public cookie = "";
  
  @BeforeAll
  public async beforeAll() {
    process.env.COOKIE_ENCRYPTION_PASSPHRASE_AES = "some_passphrase"
    await LoginTestGroup.validLoginRequest.then((res) => {
      const cookies = res.headers['set-cookie'][0].split(',').map((item: string) => item.split(';')[0]);
      this.cookie = cookies.join(';');
    });

  }

  @Test("should return HTTP 200 and a session cookie on valid login credentials")
  public async testValidLoginCredentials() {
    console.log(`cookie: ${this.cookie}`)
    
    await request(router)
      .post("/api/auth/validate")
      .set('Cookie', this.cookie)
      .expect(200)
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
