import express from "express";
import LoginService from "@/services/Login";

const router: express.Router = express.Router();

router.post("/", async (req, res) => {
  try {
    if (!req.body.username) throw new Error("Request body is missing an username.");
    if (!req.body.password) throw new Error("Request body is missing a password.");

    const sessionCookie = await LoginService.createSessionCookie(
      req.body.username,
      req.body.password
    );

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
