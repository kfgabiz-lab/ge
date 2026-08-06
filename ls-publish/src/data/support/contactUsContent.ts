export const contactUsPage = {
  title: "Contact Us",
  description: "Talk to a specialist. Get answers that move your business forward.",
  bannerImage: "/img/devices/product/banner_configurator_bg.png",
} as const;

export const contactUsBanner = {
  title: "Request Technical Support",
  description: [
    "For technical issues or development-related inquiries regarding our products, please submit a request.",
    "Our technical team will review your case and respond promptly.",
  ],
  ctaLabel: "Go to G-ICS",
  ctaHref: "https://www.ls-electric.com/",
} as const;

export const contactUsInquiryTypes = [
  { id: "product-information", label: "Product Information" },
  { id: "quotation-request", label: "Quotation Request" },
  { id: "purchase", label: "Purchase" },
  { id: "others", label: "Others" },
] as const;

export const contactUsTechnicalInquiry = {
  label: "Technical Inquiry",
  href: "https://www.ls-electric.com/",
} as const;

export const contactUsCategoryLevels = [
  { id: "lv1", label: "Lv1 Category", ariaLabel: "Product category level 1" },
  { id: "lv2", label: "Lv2 Category", ariaLabel: "Product category level 2" },
  { id: "lv3", label: "Lv3 Category", ariaLabel: "Product category level 3" },
] as const;

export const contactUsCountryOptions = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "kr", label: "Korea" },
] as const;

export const contactUsConsentItems = [
  {
    id: "personal-info",
    label: "Consent to Collection and Use of Personal Information",
    defaultChecked: false,
    termsLabel: "View Full Terms",
    termsHref: "",
  },
  {
    id: "newsletter",
    label:
      "Consent to collect and use personal information to receive newsletters",
    defaultChecked: true,
    termsLabel: "View Full Terms",
    termsHref: "",
  },
] as const;

export const contactUsPrivacyPolicyModal = {
  title: "Privacy Policy",
  confirmLabel: "Confirm",
  sections: [
    {
      heading: "General Provisions",
      paragraphs: [
        `This Privacy Policy explains how LS Electric America collects and uses your personal information in connection with its websites, applications, products, services, events, and experiences (collectively referred to as the “LS Offerings”). LS Electric America Inc. (hereinafter referred to as the “Company”) complies with U.S. federal and state privacy laws, including the applicable data protection laws and related regulations. To safeguard the personal information of data subjects and address related concerns promptly and effectively, the Company has established and published this Privacy Policy on its website (https://connect.ls-electric.com/). The Company’s Privacy Policy may be amended in response to changes in laws, government policies, or internal regulations. In such cases, the Company will promptly notify users of the changes and ensure that they can easily access the updated information.`,
        "The Company’s Privacy Policy includes the following sections:",
      ],
      listItems: [
        "WHAT INFORMATION DO WE COLLECT?",
        "WHO DO WE SHARE YOUR INFORMATION WITH ?",
        "HOW DO WE USE YOUR INFORMATION ?",
      ],
      outro:
        "information in connection with its websites, applications, products, services, events, and experiences (collectively referred to as the “LS Offerings”). LS Electric America Inc. (hereinafter referred to as the “Company”) complies with U.S. federal and state privacy laws, including the applicable data protection laws and related regulations. To safeguard the personal information of data subjects and address related concerns promptly and effectively, the Company has",
    },
  ],
} as const;

export const contactUsFormCopy = {
  inquiryType: "Inquiry Type",
  productCategory: "Product Category",
  inquirySubject: "Inquiry Subject",
  inquirySubjectPlaceholder: "Enter Subject",
  inquiryDetails: "Inquiry Details",
  inquiryDetailsPlaceholder: "Please enter your inquiry details.",
  email: "Email",
  firstName: "First Name",
  lastName: "Last Name",
  companyName: "Company Name",
  addressSearch: "Enter company name or address",
  addressSearchPlaceholder: "Keword Search",
  address2: "Address 2",
  address2Placeholder: "Address 2",
  country: "Country",
  countryPlaceholder: "Select a Country",
  stateRegion: "State/Region",
  zipCode: "Zip Code",
  password: "Password",
  passwordPlaceholder: "Enter Password",
  confirmPassword: "Confirm Password",
  confirmPasswordPlaceholder: "Enter Password Confirm",
  sendLabel: "Send",
} as const;
