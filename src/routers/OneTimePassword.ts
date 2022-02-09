import express from "express";
import OTPService from "@/services/OneTimePassword";
import TOTPConfig from "@/types/TOTPConfig";
import HTTPError from "@/utils/HTTPError";
const router: express.Router = express.Router();

router.get("/qrcode/:patientId", async (req, res) => {
  try {
    if (!req.cookies.session) throw new HTTPError("Request is missing a session cookie.", 400);

    const qrCode = await OTPService.getQrCode(req.cookies.session, req.params.patientId);

    res.status(200).send({ qrCode: qrCode });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    res.status(500).send(e.message);
    return;
  }
});

router.post("/device/:patientId", async (req, res) => {
  try {
    if (!req.body.deviceName) throw new HTTPError("Request body is missing a deviceName.", 400);
    if (!req.body.secret) throw new HTTPError("Request body is missing a secret.", 400);
    if (!req.body.initialCode) throw new HTTPError("Request body is missing an initialCode.", 400);

    const totpConfig: TOTPConfig = {
      deviceName: req.body.deviceName,
      initialCode: req.body.initialCode,
      secret: req.body.secret,
    };

    await OTPService.registerDevice(totpConfig, req.params.patientId);

    res.status(204).send();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if(e instanceof HTTPError) 
      res.status(e.status).send(e.message);
    else
      res.status(500).send(e.message);
  }
});

export default router;
