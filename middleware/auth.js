module.exports = {
  //ensures that the logged in user doesn't navigate to the login page
  ensureAuth: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    } else {
      res.redirect('/')   //login page
    }
  },
  //ensures that user first logs in 
  ensureGuest: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/dashboard');
    }
  },
}