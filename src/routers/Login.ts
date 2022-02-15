import express from "express";
import CookieService from "@/services/Cookie";
import RealmFactory from "@/models/RealmFactory";
import HTTPError from "@/utils/HTTPError";

const router: express.Router = express.Router();

router.post("/:realmName", async (req, res) => {
  try {
    if (!req.body.username) throw new HTTPError("Request body is missing a username.", 400);
    if (!req.body.password)
      throw new HTTPError("HTTP-Code 400: Request body is missing a password.", 400);

    const realm = RealmFactory.realm(req.params.realmName);
    const sessionCookie = await CookieService.createSessionCookie(
      realm,
      req.body.username,
      req.body.password
    );

    res.cookie("session", sessionCookie.value, sessionCookie.options);
    res.status(200).send();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e instanceof HTTPError) res.status(e.status).send(e.message);
    else res.status(500).send(e.message);
  }
});

export default router;
