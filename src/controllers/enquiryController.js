function contact(req, res) {
  res.render("contact-us");
}

function submitContact(req, res) {
  const { name, email, message } = req.body;

  res.status(201).json({
    success: true,
    message: "Contact request received",
    data: { name, email, message }
  });
}

module.exports = {
  contact,
  submitContact
};
