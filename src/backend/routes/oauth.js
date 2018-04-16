import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'config/config';

const client = new OAuth2Client();
const router = express.Router();

const verify = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: google.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload.sub;
  const domain = payload.hd;

  if (domain !== google.hd) {
    return '';
  }

  return userid;
};

router.get('/google_callback', (req, res) => {
  const idToken = req.query.raw.id_token;

  verify(idToken).then((userId) => {
    req.session.userId = userId;
    return res.redirect('/');
  }).catch(() => {
    console.error('Token is invalid');
    res.status(401).end();
  });
});

export default router;
