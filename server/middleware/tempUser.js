module.exports = (req, res, next) => {
  //dummy objectid for testing
  req.user = { id: '64a9b9f6e9f4b8d2a1234567' }; 
  next();
};