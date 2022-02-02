import express from "express";
import OTPService from "@/services/OneTimePassword";
import TOTPConfig from "@/types/TOTPConfig";

const router: express.Router = express.Router();

router.get("/setup/:patientId", async (req, res) => {
  try {
    if (!req.cookies.session) throw new Error("Request is missing a session cookie.");

    const qrCode = await OTPService.getQrCode(req.cookies.session, req.params.patientId);

    res.status(200).send({ qrCode: qrCode });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    res.status(403).send(e.message);
    return;
  }
});

router.post("/device/:patientId", async (req, res) => {
  try {
    if (!req.body.deviceName) throw new Error("Request body is missing a deviceName.");
    if (!req.body.secret) throw new Error("Request body is missing a secret.");
    if (!req.body.initialCode) throw new Error("Request body is missing a initialCode.");

    const totpConfig: TOTPConfig = {
      deviceName: req.body.deviceName,
      initialCode: req.body.initialCode,
      secret: req.body.secret,
    };

    await OTPService.registerDevice(totpConfig, req.params.patientId);

    res.status(204).send();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    res.status(403).send(e.message);
    return;
  }
});

export default router;
