import express from "express";
import AuthenticationService from "@/services/Authentication";

const router: express.Router = express.Router();

router.use("/", async (req, res) => {
  try {
    await AuthenticationService.verify(req);
    res.status(200).send();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    res.status(403).send(e.message);
    return;
  }
});

export default router;
