const galleryItems = [
  {
    image: "assets/images/gallery/work1.jpg",
    title: "Retail Signage Application"
  },
  {
    image: "assets/images/gallery/work2.jpg",
    title: "Large Format Media"
  },
  {
    image: "assets/images/gallery/work9.jpg",
    title: "Decorative Interior Surface"
  },
  {
    image: "assets/images/gallery/work3.jpg",
    title: "PVC Film Finish"
  },
  {
    image: "assets/images/gallery/work4.jpg",
    title: "Furniture Surface Detail"
  },
  {
    image: "assets/images/gallery/work7.jpg",
    title: "Wall Panel Application"
  },
  {
    image: "assets/images/gallery/work6.jpg",
    title: "Industrial PVC Laminate"
  },
  {
    image: "assets/images/gallery/work8.jpg",
    title: "Display Material Finish"
  },
  {
    image: "assets/images/gallery/work5.jpg",
    title: "Pioneer Product Application"
  }
];

const infrastructureGalleryItems = [
  {
    image: "assets/images/infra/1.jpeg",
    title: "Pioneer infrastructure gallery 1"
  },
  {
    image: "assets/images/infra/2.jpg",
    thumb: "assets/images/infra/thumbs/2.png",
    title: "Pioneer infrastructure gallery 2"
  },
  {
    image: "assets/images/infra/2.png",
    title: "Pioneer infrastructure gallery 3"
  },
  {
    image: "assets/images/infra/3.png",
    title: "Pioneer infrastructure gallery 4"
  },
  {
    image: "assets/images/infra/4.jpg",
    thumb: "assets/images/infra/thumbs/4.png",
    title: "Pioneer infrastructure gallery 5"
  },
  {
    image: "assets/images/infra/5.jpg",
    title: "Pioneer infrastructure gallery 6"
  },
  {
    image: "assets/images/infra/6.jpg",
    title: "Pioneer infrastructure gallery 7"
  },
  {
    image: "assets/images/infra/8.jpg",
    title: "Pioneer infrastructure gallery 8"
  },
  {
    image: "assets/images/infra/9.jpg",
    thumb: "assets/images/infra/thumbs/9.png",
    title: "Pioneer infrastructure gallery 9"
  },
  {
    image: "assets/images/infra/10.jpg",
    thumb: "assets/images/infra/thumbs/10.png",
    title: "Pioneer infrastructure gallery 10"
  },
  {
    image: "assets/images/infra/11.jpg",
    thumb: "assets/images/infra/thumbs/11.png",
    title: "Pioneer infrastructure gallery 11"
  },
  {
    image: "assets/images/infra/12.jpg",
    thumb: "assets/images/infra/thumbs/12.png",
    title: "Pioneer infrastructure gallery 12"
  },
  {
    image: "assets/images/infra/13.jpeg",
    thumb: "assets/images/infra/thumbs/13.png",
    title: "Pioneer infrastructure gallery 13"
  },
  {
    image: "assets/images/infra/14.jpeg",
    thumb: "assets/images/infra/thumbs/14.png",
    title: "Pioneer infrastructure gallery 14"
  },
  {
    image: "assets/images/infra/15.png",
    title: "Pioneer infrastructure gallery 15"
  },
  {
    image: "assets/images/infra/16.jpeg",
    thumb: "assets/images/infra/thumbs/16.png",
    title: "Pioneer infrastructure gallery 16"
  },
  {
    image: "assets/images/infra/17.png",
    title: "Pioneer infrastructure gallery 17"
  },
  {
    image: "assets/images/infra/18.jpeg",
    thumb: "assets/images/infra/thumbs/18.png",
    title: "Pioneer infrastructure gallery 18"
  },
  {
    image: "assets/images/infra/19.jpg",
    title: "Pioneer infrastructure gallery 19"
  }
];

const blogPosts = [
  {
    slug: "pvc-decorative-films",
    category: "PVC Decorative Films",
    title: "PVC decorative films for furniture, doors, and modular interiors",
    image: "assets/images/blog/1.jpeg",
    alt: "PVC decorative film being applied on a wood finish surface"
  },
  {
    slug: "pvc-wpc-interior-louvers",
    category: "PVC/WPC Interior Louvers",
    title: "PVC/WPC interior louvers for feature walls and commercial interiors",
    image: "assets/images/blog/2.webp",
    alt: "PVC WPC interior louvers installed on an interior wall"
  },
  {
    slug: "wpc-doors-and-frames",
    category: "WPC Doors and Frames",
    title: "WPC doors and frames built for moisture-resistant interior fitment",
    image: "assets/images/blog/3.avif",
    alt: "WPC door and frame installed in a modern interior"
  },
  {
    slug: "pvc-wpc-baffles",
    category: "PVC/WPC Baffles",
    title: "PVC/WPC baffles for linear screens, facades, and ceilings",
    image: "assets/images/blog/3.jpeg",
    alt: "PVC WPC baffle screen used on an exterior facade"
  }
];

const careerOpenings = [
  {
    slug: "sales-executive",
    title: "Sales Executive",
    department: "Sales",
    location: "Rudrapur / Field Sales",
    type: "Full Time",
    experience: "2-5 Years",
    summary:
      "Build dealer, architect, contractor, and project relationships for Pioneer product categories across interior and decorative material markets.",
    responsibilities: [
      "Develop new customer relationships for PVC Decorative Films, PVC/WPC Interior Louvers, WPC Doors and Frames, and PVC/WPC Baffles.",
      "Coordinate product samples, catalogues, quotations, follow-ups, and site requirement discussions.",
      "Maintain regular market feedback on product demand, pricing, applications, and competitor activity."
    ],
    requirements: [
      "Experience in building materials, interior products, laminates, panels, doors, profiles, or related sales.",
      "Comfortable with field visits, customer meetings, follow-ups, and basic reporting.",
      "Strong communication skills in Hindi and English."
    ]
  },
  {
    slug: "production-supervisor",
    title: "Production Supervisor",
    department: "Manufacturing",
    location: "Rudrapur Plant",
    type: "Full Time",
    experience: "3-6 Years",
    summary:
      "Support daily production planning, line coordination, and shop-floor discipline for PVC and WPC processing operations.",
    responsibilities: [
      "Coordinate shift output, manpower allocation, machine readiness, and production documentation.",
      "Work with quality and dispatch teams to maintain batch consistency and timely movement.",
      "Escalate maintenance, safety, material, and process concerns to plant leadership."
    ],
    requirements: [
      "Experience in PVC, plastic processing, lamination, coating, extrusion, or allied manufacturing.",
      "Ability to read production plans and maintain daily reports.",
      "Practical understanding of safety, housekeeping, and line discipline."
    ]
  },
  {
    slug: "quality-control-executive",
    title: "Quality Control Executive",
    department: "Quality",
    location: "Rudrapur Plant",
    type: "Full Time",
    experience: "2-4 Years",
    summary:
      "Inspect incoming materials, in-process output, and finished products for finish, durability, printability, and dispatch readiness.",
    responsibilities: [
      "Check raw material, coating, lamination, finishing, and converted product quality parameters.",
      "Maintain inspection records, batch observations, and corrective action follow-ups.",
      "Coordinate with production teams to reduce repeat defects and improve process consistency."
    ],
    requirements: [
      "Quality experience in PVC, WPC, plastic, decorative surfaces, films, panels, or allied materials.",
      "Comfortable with visual inspection, basic measuring tools, and production documentation.",
      "Detail-oriented working style with clear reporting habits."
    ]
  },
  {
    slug: "sales-and-marketing-intern",
    title: "Sales & Marketing Intern",
    department: "Internship",
    location: "Rudrapur / Remote Support",
    type: "Internship",
    experience: "Freshers",
    summary:
      "Assist the Pioneer team with catalogue coordination, customer research, lead follow-up, and product communication support.",
    responsibilities: [
      "Prepare lead lists, customer records, sample follow-ups, and catalogue sharing updates.",
      "Support social, product, and market research for Pioneer product categories.",
      "Coordinate with sales and office teams for day-to-day communication tasks."
    ],
    requirements: [
      "Graduate or pursuing studies in business, marketing, communication, or a related field.",
      "Good phone, email, and documentation skills.",
      "Interest in interior products, decorative materials, and B2B sales."
    ]
  }
];

module.exports = {
  blogPosts,
  careerOpenings,
  galleryItems,
  infrastructureGalleryItems
};
