module.exports = {
  lockSeat: (req, res) => {
    res.send({ message: 'seat lock endpoint ready' });
  },
  confirmReservation: (req, res) => {
    res.send({ message: 'confirm reservation endpoint ready' });
  }
};
