import express from "express";
import OTPService from "@/services/OneTimePassword";

const router: express.Router = express.Router();

router.use("/:patientId", async (req, res) => {
  try {
    if (!req.cookies.session) throw new Error("Request is missing a session cookie.");

    const realmName = await OTPService.getAuthorizedRealmName(req.cookies.session);
    const qrCode = await OTPService.getQrCode(req.params.patientId);

    res.setHeader("X-Auth-Realm", realmName);
    res.status(200).send(qrCode);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    res.status(403).send(e.message);
    return;
  }
});

export default router;
