import express from 'express';

import {scopes} from '../config/oauth';

const router = express.Router();

/* GET home page. */
router.get('/', function(_, res) {
  const clientID = process.env.SLACK_CLIENT_ID;
  const addToSlackUrl = `https://slack.com/oauth/v2/authorize?scope=${scopes.toString()}&client_id=${clientID}`;
  res.send(`<a href=${addToSlackUrl}>Install</a>`);
});

export default router;