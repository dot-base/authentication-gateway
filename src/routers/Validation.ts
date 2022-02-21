import express from "express";
import CookieService from "@/services/Cookie";
import TokenIntrospection from "@/types/TokenIntrospection";
import JwtUtil from "@/utils/Jwt";
import HTTPError from "@/utils/HTTPError";

const router: express.Router = express.Router();

router.use("/", async (req, res) => {
  try {
    if (!req.cookies.session) throw new HTTPError("Request is missing a session cookie.", 401);

    const isExpired = await CookieService.validateCookieExpiration(req.cookies.session);

    if (isExpired) {
      const sessionCookie = await CookieService.renewSessionCookie(req.cookies.session);
      res.cookie("session", sessionCookie.value, sessionCookie.options);

      const host = req.headers["x-forwarded-host"];
      const protocol = req.headers["x-forwarded-proto"];
      const uri = req.headers["x-forwarded-uri"];
      if (typeof host !== "string" || typeof protocol !== "string" || typeof uri !== "string")
        throw new HTTPError("Forwarded URI is invalid.", 400);
      res.setHeader("Location", new URL(uri, `${protocol}://${host}`).toString());

      res.status(307).send();
    }

    if (!isExpired) {
      const inspectedToken: TokenIntrospection = await CookieService.validateSessionCookie(
        req.cookies.session
      );

      const realmName = JwtUtil.getTokenIssuerRealm(inspectedToken);
      res.setHeader("X-Auth-Realm", realmName);

      const user = inspectedToken.email ?? inspectedToken.username ?? "";
      res.setHeader("X-Forwarded-User", user);
      res.status(200).send();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e instanceof HTTPError) res.status(e.status).send(e.message);
    else res.status(500).send(e.message);
  }
});

export default router;
