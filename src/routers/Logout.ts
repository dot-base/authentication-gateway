import express from "express";

import CookieService from "@/services/Cookie";
import HTTPError from "@/utils/HTTPError";

const router: express.Router = express.Router();

router.post("/:realmName", async (req, res) => {
  try {
    if (!req.cookies.session) throw new HTTPError("Request is missing a session cookie.", 401);

    await CookieService.invalidateSessionCookie(req.cookies.session);
    res.clearCookie("session");

    res.status(200).send();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if(e instanceof HTTPError) 
      res.status(e.status).send(e.message);
    else
      res.status(500).send(e.message);
  }
});

export default router;
