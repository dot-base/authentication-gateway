import express from "express";
import OTPService from "@/services/OneTimePassword";

const router: express.Router = express.Router();

router.use("/setup/:patientId", async (req, res) => {
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

export default router;
