import express from "express";
import CookieService from "@/services/Cookie";
import RealmFactory from "@/models/RealmFactory";

const router: express.Router = express.Router();

router.post("/:realmName", async (req, res) => {
  try {
    if (!req.body.username) throw new Error("Request body is missing a username.");
    if (!req.body.password) throw new Error("Request body is missing a password.");

    const realm = RealmFactory.realm(req.params.realmName);
    const sessionCookie = await CookieService.createSessionCookie(
      realm,
      req.body.username,
      req.body.password
    );

    res.cookie("session", sessionCookie, {
      expires: new Date(Date.now() + 2700000),
      httpOnly: true,
    });
    res.status(200).send();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    res.status(401).send(e.message);
    return;
  }
});

export default router;
