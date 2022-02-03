import express from "express";
import CookieService from "@/services/Cookie";

const router: express.Router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!req.cookies.session) throw new Error("Request is missing a session cookie.");

    const userinfo = await CookieService.getUserInfo(req.cookies.session);

    res.status(200).send(userinfo);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    res.status(403).send(e.message);
    return;
  }
});

export default router;
