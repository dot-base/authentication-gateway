import express from "express";
import CookieService from "@/services/Cookie";

const router: express.Router = express.Router();

router.use("/", async (req, res) => {
  try {
    if (!req.cookies.session) throw new Error("Request is missing a session cookie.");

    await CookieService.validateSessionCookie(req.cookies.session);

    res.status(200).send();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    res.status(403).send(e.message);
    return;
  }
});

export default router;
