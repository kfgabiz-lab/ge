export type ServiceTrainingCourse = {
  id: string;
  category: string;
  title: string;
  description: string;
  descriptionLines?: string[];
  image: string;
};

export type ServiceTrainingFilterOption = {
  value: string;
  label: string;
};

export const serviceTrainingCategoryOptions: ServiceTrainingFilterOption[] = [
  { value: "all", label: "All" },
  { value: "automation", label: "Automation" },
  { value: "power", label: "Power" },
  { value: "energy", label: "Energy" },
  { value: "motion", label: "Motion" },
];

export const serviceTrainingLvCategoryOptions: ServiceTrainingFilterOption[] = [
  { value: "all", label: "All" },
  { value: "lv", label: "LV" },
  { value: "mv", label: "MV" },
  { value: "hv", label: "HV" },
];

export const serviceTrainingSubCategoryOptions: ServiceTrainingFilterOption[] = [
  { value: "all", label: "All" },
  { value: "breaker", label: "Breaker" },
  { value: "switchgear", label: "Switchgear" },
  { value: "transformer", label: "Transformer" },
  { value: "drive", label: "Drive" },
  { value: "plc", label: "PLC" },
  { value: "hmi", label: "HMI" },
];

/** Reuse Engineering Training imagery until Service-specific assets are provided */
const IMG = "/pub/img/services/engineering-training";

const BREAKER_DESC =
  "A comprehensive service training program covering LS ELECTRIC's full switchgear product lineup — from Medium Voltage (5kV to 38kV MCSG and LIS) to Low Voltage (UL1558, UL891, UL67) systems — building the field competence technicians need for installation, commissioning, and maintenance.";

const SWITCHGEAR_DESC =
  "A comprehensive service training program covering LS ELECTRIC's full switchgear product lineup — from Medium Voltage (5kV to 38kV MCSG and LIS) to Low Voltage (UL1558, UL891, UL67) systems — building the field competence technicians need for installation, commissioning, and maintenance.";

export const serviceTrainingPage = {
  title: "Service Training",
  description:
    "Service operations training for customers using the LS's products (focused on hands-on practice and troubleshooting)",
  curriculum: {
    filters: {
      category: {
        label: "Category",
        defaultValue: serviceTrainingCategoryOptions[0].value,
        options: serviceTrainingCategoryOptions,
      },
      lvCategory: {
        label: "Lv Category",
        defaultValue: serviceTrainingLvCategoryOptions[0].value,
        options: serviceTrainingLvCategoryOptions,
      },
      subCategory: {
        label: "Sub Category",
        defaultValue: serviceTrainingSubCategoryOptions[0].value,
        options: serviceTrainingSubCategoryOptions,
      },
      searchPlaceholder: "Search",
    },
    pageSize: 5,
    totalPages: 5,
    courses: [
      {
        id: "breaker-training",
        category: "AUTOMATION",
        title: "Hands-on Breaker Training: MCCB · ACB · VCB",
        description: BREAKER_DESC,
        image: `${IMG}/course-01.jpg`,
      },
      {
        id: "transformer-fundamentals",
        category: "POWER",
        title: "Transformer Fundamentals and Design",
        descriptionLines: [
          "This course covers transformer fundamentals, HV product specifications, pad-mounted and cast resin transformer types,",
          "design features, and manufacturing & inspection processes.",
        ],
        description: "",
        image: `${IMG}/course-02.jpg`,
      },
      {
        id: "protective-measuring",
        category: "POWER",
        title: "Protective and Measuring Devices",
        descriptionLines: [
          "A comprehensive service training covering everything from transformer fundamentals to LS ELECTRIC's HV, pad-mounted,",
          "and cast resin transformer product specifications, design features, and manufacturing and inspection processes.",
        ],
        description: "",
        image: `${IMG}/course-03.jpg`,
      },
      {
        id: "switchgear",
        category: "POWER",
        title: "Switchgear",
        description: SWITCHGEAR_DESC,
        image: `${IMG}/course-04.jpg`,
      },
      {
        id: "switchgear-communication",
        category: "POWER",
        title: "Switchgear Communication Structure",
        description: SWITCHGEAR_DESC,
        image: `${IMG}/course-05.jpg`,
      },
      {
        id: "breaker-training-2",
        category: "POWER",
        title: "Hands-on Breaker Training: MCCB · ACB · VCB",
        description: BREAKER_DESC,
        image: `${IMG}/course-01.jpg`,
      },
      {
        id: "transformer-fundamentals-2",
        category: "POWER",
        title: "Transformer Fundamentals and Design",
        descriptionLines: [
          "This course covers transformer fundamentals, HV product specifications, pad-mounted and cast resin transformer types,",
          "design features, and manufacturing & inspection processes.",
        ],
        description: "",
        image: `${IMG}/course-02.jpg`,
      },
      {
        id: "protective-measuring-2",
        category: "POWER",
        title: "Protective and Measuring Devices",
        descriptionLines: [
          "A comprehensive service training covering everything from transformer fundamentals to LS ELECTRIC's HV, pad-mounted,",
          "and cast resin transformer product specifications, design features, and manufacturing and inspection processes.",
        ],
        description: "",
        image: `${IMG}/course-03.jpg`,
      },
      {
        id: "switchgear-2",
        category: "POWER",
        title: "Switchgear",
        description: SWITCHGEAR_DESC,
        image: `${IMG}/course-04.jpg`,
      },
      {
        id: "switchgear-communication-2",
        category: "POWER",
        title: "Switchgear Communication Structure",
        description: SWITCHGEAR_DESC,
        image: `${IMG}/course-05.jpg`,
      },
    ] satisfies ServiceTrainingCourse[],
  },
};
