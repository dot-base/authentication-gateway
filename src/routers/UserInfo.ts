import express from "express";
import CookieService from "@/services/Cookie";
import HTTPError from "@/utils/HTTPError";

const router: express.Router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!req.cookies.session) throw new HTTPError("Request is missing a session cookie.", 401);

    if (req.headers["x-auth-realm"] !== process.env.KEYCLOAK_DOTBASE_REALM_NAME)
      throw new HTTPError("The user is not authorized to request userinfo", 403);

    const userinfo = await CookieService.getUserInfo(req.cookies.session);

    res.status(200).send(userinfo);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e instanceof HTTPError) res.status(e.status).send(e.message);
    else res.status(500).send(e.message);
  }
});

export default router;
