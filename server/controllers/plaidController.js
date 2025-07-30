// after exchangeRes comes back
await User.findByIdAndUpdate(req.user.id, {
  plaidAccessToken: exchangeRes.data.access_token,
  plaidItemId: exchangeRes.data.item_id,
});
