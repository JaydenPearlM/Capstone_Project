const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const router = require('express').Router();

// initialize Plaid client
const client = new PlaidApi(new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET':   process.env.PLAID_SECRET,
    },
  },
}));

// 1) Create a Link Token
router.post('/create_link_token', async (req, res) => {
  try {
    const linkRes = await client.linkTokenCreate({
      user: { client_user_id: req.body.userId },
      client_name: 'CacheBudget (Sandbox)',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    res.json({ link_token: linkRes.data.link_token });
  } catch (err) {
    console.error('linkTokenCreate error:', err.response?.data || err);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// 2) Exchange Public Token for Access Token
router.post('/exchange_public_token', async (req, res) => {
  try {
    const { public_token } = req.body;
    const exchangeRes = await client.itemPublicTokenExchange({ public_token });
    // TODO: store exchangeRes.data.access_token & item_id securely
    res.json({
      access_token: exchangeRes.data.access_token,
      item_id:      exchangeRes.data.item_id,
    });
  } catch (err) {
    console.error('exchangePublicToken error:', err.response?.data || err);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

module.exports = router;
