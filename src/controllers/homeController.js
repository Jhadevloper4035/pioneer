const {
  blogPosts,
  careerOpenings,
  galleryItems,
  infrastructureGalleryItems
} = require("../data/siteContent");

function renderHome(res, variantOptions = {}) {
  res.render("index", {
    blogPosts,
    galleryItems,
    ...variantOptions
  });
}

function home(req, res) {
  renderHome(res, {
    homeVariant: "grid",
    showCategoryGrid: true,
    showDecorativeZigzag: false
  });
}

function homeGrid(req, res) {
  renderHome(res, {
    homeVariant: "grid",
    showCategoryGrid: true,
    showDecorativeZigzag: false
  });
}

function homeZigzag(req, res) {
  renderHome(res, {
    homeVariant: "zigzag",
    showCategoryGrid: false,
    showDecorativeZigzag: true
  });
}

function aboutCompany(req, res) {
  res.render("about-company");
}

function infrastructure(req, res) {
  res.render("infrastructure", { galleryItems: infrastructureGalleryItems });
}

function career(req, res) {
  res.render("career", { careerOpenings });
}

function careerOpening(req, res) {
  const opening = careerOpenings.find((item) => item.slug === req.params.slug);

  if (!opening) {
    return res.redirect(302, "/career");
  }

  return res.render("career-opening", { opening, careerOpenings });
}

function termsAndConditions(req, res) {
  res.render("legal-page", {
    pageTitle: "Terms & Conditions | Pioneer Flex",
    pageDescription:
      "Read the website terms and conditions for Pioneer Flex product information, enquiries, catalogues, and website use.",
    hero: {
      tag: "(Legal)",
      title: "Terms & Conditions",
      text: "Guidelines for using the Pioneer Flex website, product information, enquiries, and catalogue resources."
    },
    sections: [
      {
        title: "Website Use",
        body: [
          "This website is provided for general information about Pioneer Flex products, infrastructure, catalogues, and contact channels.",
          "By using this website, you agree to use the content only for lawful enquiry, evaluation, and business communication purposes."
        ]
      },
      {
        title: "Product Information",
        body: [
          "Product images, shades, dimensions, specifications, and application notes are indicative and may vary by batch, screen display, installation condition, or project requirement.",
          "Final suitability should be confirmed through samples, technical discussion, and written commercial confirmation from Pioneer Flex."
        ]
      },
      {
        title: "Quotations & Orders",
        body: [
          "Website enquiries do not create a confirmed order, supply commitment, price lock, or delivery obligation.",
          "Prices, taxes, freight, availability, lead times, and order terms are confirmed separately by the Pioneer Flex team."
        ]
      },
      {
        title: "Intellectual Property",
        body: [
          "The Pioneer Flex name, website content, product visuals, catalogues, graphics, and layout are owned by or licensed to Pioneer Flex.",
          "Content from this website may not be copied, republished, modified, or used commercially without prior written permission."
        ]
      },
      {
        title: "Limitation",
        body: [
          "Pioneer Flex works to keep website information useful and current, but does not guarantee that all content is complete, error-free, or suitable for every project condition.",
          "For project-critical decisions, please contact Pioneer Flex directly for the latest technical and commercial details."
        ]
      }
    ]
  });
}

function privacyPolicy(req, res) {
  res.render("legal-page", {
    pageTitle: "Privacy Policy | Pioneer Flex",
    pageDescription:
      "Learn how Pioneer Flex handles website enquiry, catalogue, and contact information submitted through the website.",
    hero: {
      tag: "(Legal)",
      title: "Privacy Policy",
      text: "How Pioneer Flex handles information shared through enquiry forms, catalogue access, and contact requests."
    },
    sections: [
      {
        title: "Information We Collect",
        body: [
          "When you submit a form, request a catalogue, or contact Pioneer Flex, we may collect details such as your name, phone number, email address, company, city, product interest, and message.",
          "Basic technical information may also be processed to help maintain website performance and security."
        ]
      },
      {
        title: "How We Use Information",
        body: [
          "We use submitted information to respond to enquiries, share catalogues, coordinate samples, discuss product requirements, and improve customer communication.",
          "We may also use enquiry context to understand demand for product categories and service improvements."
        ]
      },
      {
        title: "Sharing",
        body: [
          "Information may be shared with authorised Pioneer Flex team members, service providers, or business partners only where needed to respond to your request or support operations.",
          "We do not sell submitted enquiry information as a standalone product."
        ]
      },
      {
        title: "Retention & Security",
        body: [
          "We retain enquiry information for as long as reasonably needed for business communication, record keeping, service follow-up, and legal or operational requirements.",
          "Reasonable safeguards are used to protect submitted information, though no website or transmission method can be guaranteed completely secure."
        ]
      },
      {
        title: "Contact",
        body: [
          "For privacy-related questions or correction requests, contact Pioneer Flex through the website contact form or email sks@pioneerflex.in.",
          "We may update this policy as website features, business processes, or legal requirements evolve."
        ]
      }
    ]
  });
}

function indexRedirect(req, res) {
  res.redirect(301, "/");
}

module.exports = {
  aboutCompany,
  career,
  careerOpening,
  home,
  homeGrid,
  homeZigzag,
  infrastructure,
  indexRedirect,
  privacyPolicy,
  termsAndConditions
};
