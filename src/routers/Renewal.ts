import express from "express";
import CookieService from "@/services/Cookie";
import RealmFactory from "@/models/RealmFactory";

const router: express.Router = express.Router();

router.post("/:realmName", async (req, res) => {
  try {
    if (!req.cookies.session) throw new Error("Request is missing a session cookie.");

    const realm = RealmFactory.realm(req.params.realmName);
    const sessionCookie = await CookieService.renewSessionCookie(realm, req.cookies.session);

    res.cookie("session", sessionCookie, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });
    res.status(200).send();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    res.status(403).send(e.message);
    return;
  }
});

export default router;
