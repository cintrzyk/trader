import express from 'express';
import crypto from 'crypto';
import bodyParser from 'body-parser';
import webhookHandler from '../github/webhook-handler';

const { GITHUB_APP_SECRET } = process.env;
const router = express.Router();
const jsonParser = bodyParser.json();

const verifySignature = (req) => {
  const payloadBody = JSON.stringify(req.body);
  const signature = crypto.createHmac('sha1', GITHUB_APP_SECRET).update(payloadBody).digest('hex');
  const ghSignature = req.headers['x-hub-signature'];
  return crypto.timingSafeEqual(Buffer.from(`sha1=${signature}`), Buffer.from(ghSignature));
};

router.post('/', jsonParser, (req, res) => {
  if (!verifySignature(req)) {
    return res.status(401).end("Signatures didn't match!");
  }

  res.status(200).end();
  return webhookHandler(req.body);
});

export default router;
