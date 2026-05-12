export const TERMS_VERSION = "2023-12-15";
export const TERMS_EFFECTIVE_DATE_LABEL = "January 1, 2024";
export const TERMS_LAST_UPDATED_LABEL = "December 15, 2023";

export type TermsCallout = {
  body: string;
  title: string;
  tone: "info" | "warning";
};

export type TermsSection = {
  bullets?: string[];
  callout?: TermsCallout;
  group: "Privacy Policy" | "Regulatory" | "Terms of Service";
  id: string;
  paragraphs: string[];
  title: string;
};

export const TERMS_SECTIONS: TermsSection[] = [
  {
    bullets: [
      '"Platform" refers to the Stakeloop web experience, dashboards, and supporting digital interfaces.',
      '"User" refers to any individual who maintains an active Stakeloop account.',
      '"Digital Fund" refers to the pooled sports prediction liquidity made available through the platform.',
      '"ROI" refers to the return on investment as calculated by the platform performance engine.',
    ],
    group: "Terms of Service",
    id: "definitions",
    paragraphs: [
      "The definitions below explain how key words are used throughout these terms.",
    ],
    title: "Definitions",
  },
  {
    callout: {
      body: "Sports prediction markets involve significant risk of loss. Past performance does not guarantee future results, and you should only commit funds you can afford to lose.",
      title: "Risk Warning",
      tone: "warning",
    },
    group: "Terms of Service",
    id: "fund-management",
    paragraphs: [
      "Stakeloop acts as a facilitator for sports prediction participation. By funding your account or using related features, you acknowledge that platform operations, liquidity management, and distributions follow the product rules active at the time of use.",
      "Any applicable fees, allocation rules, and settlement timelines are governed by the active offer and user-facing disclosures shown in your account experience.",
    ],
    title: "Fund Management",
  },
  {
    bullets: [
      "Maintain the confidentiality of your login credentials and account access.",
      "Provide complete and accurate onboarding and banking information.",
      "Ensure that any funds used on the platform come from lawful sources.",
      "Report suspicious activity or unauthorized account access as soon as possible.",
    ],
    group: "Terms of Service",
    id: "user-obligations",
    paragraphs: [
      "You must be at least 18 years old and use the service only where participation is legally permitted.",
      "You are responsible for keeping your account information current and for complying with any onboarding or verification requests that support secure platform use.",
    ],
    title: "User Obligations",
  },
  {
    group: "Terms of Service",
    id: "risk-disclosure",
    paragraphs: [
      "Participation on Stakeloop carries financial risk. Outcomes may vary, and losses are possible even where historical performance or market expectations appear favorable.",
      "Stakeloop is not presenting personalized investment advice, and platform information should not be treated as a guarantee of profit or a substitute for independent judgment.",
    ],
    title: "Risk Disclosure",
  },
  {
    bullets: [
      "Identity and verification information needed to support onboarding and compliance checks.",
      "Transaction history, account activity, and platform interaction records.",
      "Technical information such as IP address, browser details, and device identifiers used for fraud prevention and security review.",
    ],
    group: "Privacy Policy",
    id: "data-collection",
    paragraphs: [
      "We collect the information required to operate a secure and reliable user experience.",
    ],
    title: "Data Collection",
  },
  {
    callout: {
      body: "Stakeloop does not sell your personal information to third-party advertisers. Data sharing is limited to essential service providers and legal or regulatory requests where disclosure is required.",
      title: "Data Transparency",
      tone: "info",
    },
    group: "Privacy Policy",
    id: "security",
    paragraphs: [
      "We use security controls designed to protect account data, platform records, and communication between your browser and our services.",
      "These protections may include encryption, access controls, monitoring, and periodic reviews intended to reduce unauthorized access or misuse.",
    ],
    title: "Security Measures",
  },
  {
    group: "Privacy Policy",
    id: "cookies",
    paragraphs: [
      "Stakeloop uses essential cookies and similar technologies to keep your session secure, remember critical preferences, and help the product function correctly.",
      "We may also use limited analytics signals to understand how users navigate the experience so we can improve onboarding, readability, and reliability.",
    ],
    title: "Cookies & Tracking",
  },
  {
    bullets: [
      "You may be asked to complete identity, bank, or account verification checks before accessing certain features.",
      "Stakeloop may restrict, review, or suspend activity that appears inconsistent with legal, security, or anti-fraud requirements.",
      "Records may be retained where necessary to meet compliance, operational, or dispute-resolution obligations.",
    ],
    group: "Regulatory",
    id: "compliance",
    paragraphs: [
      "Stakeloop may apply AML, KYC, fraud-prevention, and account integrity checks as part of onboarding and continued platform access.",
    ],
    title: "AML & KYC Compliance",
  },
] as const;

export const TERMS_GROUP_ORDER = [
  "Terms of Service",
  "Privacy Policy",
  "Regulatory",
] as const;
