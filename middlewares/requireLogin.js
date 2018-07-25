module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).send({ error: 'You must log in!' })
  }
  next(); // next is a function that we call if our function is complete, we call it next to indicate that it will pass off to the next middleware of the chain
};
