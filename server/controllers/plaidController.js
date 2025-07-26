// after exchangeRes comes back
async function updatePlaidAccessToken(req, exchangeRes) {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      plaidAccessToken: exchangeRes.data.access_token,
      plaidItemId: exchangeRes.data.item_id,
    });
  } catch (error) {
    console.error("Error updating Plaid access token:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

module.exports = { updatePlaidAccessToken };
