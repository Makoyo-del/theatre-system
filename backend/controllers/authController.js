module.exports = {
  login: (req, res) => {
    res.send({ message: 'login endpoint ready' });
  },
  register: (req, res) => {
    res.send({ message: 'register endpoint ready' });
  }
};
