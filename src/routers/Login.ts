import express, { Request } from "express";
import Service from "@/services/Login";

const router: express.Router = express.Router();

router.use("/", async (req, res) => {
  try {
    validate(req);
    await Service.login(req);
    res.status(200).send();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    res.status(403).send(e.message);
    return;
  }
});

function validate(req: Request) {
  if (!req.body.username) throw new Error("Request body is missing an username.");
  if (!req.body.password) throw new Error("Request body is missing a password.");
}

export default router;
