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

function submitCareerApplication(req, res) {
  const { role, name, email, phone, experience, city, message } = req.body;
  const requiredFields = { role, name, email, phone, experience, city };
  const missingField = Object.entries(requiredFields).find(([, value]) => !value || !String(value).trim());

  if (missingField) {
    return res.status(400).json({
      success: false,
      message: "Please complete all required application details."
    });
  }

  return res.status(201).json({
    success: true,
    message: "Application submitted successfully. Our team will review your profile and connect soon.",
    data: {
      role,
      name,
      email,
      phone,
      experience,
      city,
      message,
      resume: req.file
        ? {
            filename: req.file.filename,
            originalName: req.file.originalName,
            size: req.file.size
          }
        : null
    }
  });
}

module.exports = {
  contact,
  submitCareerApplication,
  submitContact
};
