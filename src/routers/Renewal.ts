import express from "express";
import CookieService from "@/services/Cookie";

const router: express.Router = express.Router();

router.use("/:realmName", async (req, res) => {
  try {
    if (!req.cookies.session) throw new Error("Request is missing a session cookie.");

    const sessionCookie = await CookieService.renewSessionCookie(
      req.params.realmName,
      req.cookies.session
    );

    res.cookie("session", sessionCookie, {
      expires: new Date(Date.now() + 900000),
      httpOnly: true,
    });
    res.setHeader("X-Auth-Realm",req.params.realmName)
    res.status(200).send();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    res.status(403).send(e.message);
    return;
  }
});

export default router;
