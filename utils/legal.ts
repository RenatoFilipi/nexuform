import { APP_NAME, SUPPORT_EMAIL } from "./envs";

export const privacyTopics = [
  {
    title: "1. Information We Collect",
    description: [
      `When you use ${APP_NAME}, we may collect:`,
      "- Personal information (name, email address, company details)",
      "- Form data you create and responses you collect",
      "- Usage data (features used, time spent, interactions)",
      "- Technical data (IP address, browser type, device information)",
      "",
      "We collect this information to provide, maintain, and improve our services.",
    ],
  },
  {
    title: "2. How We Use Your Information",
    description: [
      "Your data helps us to:",
      "✓ Provide and personalize our form builder services",
      "✓ Improve product functionality and user experience",
      "✓ Communicate important service updates",
      "✓ Respond to customer support requests",
      "✓ Enhance security and prevent fraud",
      "",
      "We never sell your data to third parties.",
    ],
  },
  {
    title: "3. Data Security & Protection",
    description: [
      "We implement robust security measures including:",
      "🔒 AES-256 encryption for data at rest and in transit",
      "🔒 Regular security audits and vulnerability testing",
      "🔒 Strict access controls and authentication protocols",
      "",
      "While we take every precaution, no internet transmission is 100% secure. We recommend using strong passwords and enabling all available security features.",
    ],
  },
  {
    title: "4. Cookies & Tracking Technologies",
    description: [
      `${APP_NAME} uses cookies to:`,
      "• Remember user preferences and settings",
      "• Analyze product usage patterns",
      "• Deliver personalized experiences",
      "",
      "You can manage cookies through your browser settings, though this may affect functionality.",
    ],
  },
  {
    title: "5. Third-Party Services",
    description: [
      "We integrate with trusted providers for:",
      "• Payment processing (Stripe)",
      "• Cloud infrastructure (Supabase, Vercel)",
      "",
      "These services have their own privacy policies governing data handling.",
    ],
  },
  {
    title: "6. Your Data Rights",
    description: [
      "You have the right to:",
      "→ Access your personal data we hold",
      "→ Request correction of inaccurate information",
      "→ Delete your account and associated data",
      "→ Export your form data at any time",
      "→ Object to specific data processing",
      "",
      `To exercise these rights, contact us at ${SUPPORT_EMAIL}.`,
    ],
  },
  {
    title: "7. Policy Updates",
    description: [
      "We may update this policy to reflect:",
      "• Changes in our services",
      "• New legal requirements",
      "• Industry best practices",
      "",
      "Significant changes will be communicated via email or in-app notifications. The 'Last Updated' date at the top indicates the latest revision.",
    ],
  },
];
export const termsTopics = [
  {
    title: "1. Acceptance of Terms",
    description: [
      `By accessing or using ${APP_NAME}'s services, you confirm that:`,
      "✓ You have read and understood these Terms",
      "✓ You agree to be legally bound by them",
      "✓ You are at least 18 years old or have parental consent",
      "",
      "If you disagree with any part of these terms, you must immediately stop using our services.",
    ],
  },
  {
    title: "2. Account Registration & Use",
    description: [
      "When creating an account, you agree to:",
      "• Provide accurate and complete information",
      "• Maintain the security of your credentials",
      "• Be responsible for all activities under your account",
      "",
      "Prohibited activities include:",
      "✗ Spamming, phishing, or illegal content collection",
      "✗ Reverse engineering or exploiting vulnerabilities",
      "✗ Impersonation or misrepresentation",
    ],
  },
  {
    title: "3. Intellectual Property Rights",
    description: [
      `All rights to ${APP_NAME} are reserved, including:`,
      "🔹 Software, code, and platform architecture",
      "🔹 Branding, logos, and visual assets",
      "🔹 Documentation and knowledge base content",
      "",
      "You retain ownership of the forms you create, but grant us a license to:",
      "• Host, process, and display your forms",
      "• Provide technical support and maintenance",
      "• Improve our services",
    ],
  },
  {
    title: "4. Service Limitations",
    description: [
      "While we strive for excellence, please note:",
      "• We don't guarantee 100% uptime (see our SLA for details)",
      "• Form response data is your responsibility to backup",
      "• Certain features may be restricted based on your plan",
      "",
      "Fair use policies apply to prevent system abuse.",
    ],
  },
  {
    title: "5. Liability & Disclaimers",
    description: [
      "To the extent permitted by law:",
      "⚠️ We're not liable for indirect or consequential damages",
      "⚠️ We don't warrant that the service will meet all your requirements",
      "⚠️ You use third-party integrations at your own risk",
      "",
      "Our total liability is limited to your last 3 months of payments.",
    ],
  },
  {
    title: "6. Termination & Suspension",
    description: [
      "We may suspend or terminate accounts for:",
      "• Violation of these terms",
      "• Non-payment of fees",
      "• Legal or security requirements",
      "",
      "You may cancel anytime via your account settings.",
    ],
  },
  {
    title: "7. Changes to Terms",
    description: [
      "We may update these terms to reflect:",
      "• New features or services",
      "• Legal or regulatory changes",
      "• Business model adjustments",
      "",
      "Material changes will be communicated via email at least 30 days in advance. Continued use constitutes acceptance.",
    ],
  },
  {
    title: "8. Governing Law",
    description: [
      "These terms are governed by the laws of [Your Country/State].",
      "Any disputes will be resolved in [Jurisdiction] courts.",
      "",
      "For questions about these terms, contact:",
      `${SUPPORT_EMAIL}`,
    ],
  },
];
export const cookieTypes = [
  {
    category: "Essential Cookies",
    purpose: "These cookies are necessary for the website to function properly.",
    examples: [
      "Authentication cookies to keep you logged in",
      "Session cookies to maintain your preferences during navigation",
      "Security cookies for fraud prevention",
    ],
    duration: "Session or up to 24 months",
  },
  {
    category: "Performance Cookies",
    purpose: "These help us understand how visitors interact with our website.",
    examples: [
      "Analytics cookies to track page visits and navigation paths",
      "Load balancing cookies for optimal performance",
      "Error tracking cookies to identify issues",
    ],
    duration: "Up to 12 months",
  },
  {
    category: "Functional Cookies",
    purpose: "These enable enhanced functionality and personalization.",
    examples: [
      "Language preference cookies",
      "Feature customization cookies",
      "Third-party integration cookies (e.g., embedded forms)",
    ],
    duration: "Up to 12 months",
  },
  {
    category: "Targeting/Advertising Cookies",
    purpose: "Used to deliver relevant ads and measure ad performance.",
    examples: [
      "Social media cookies for sharing features",
      "Retargeting cookies for marketing campaigns",
      "Affiliate tracking cookies",
    ],
    duration: "Up to 24 months",
  },
];
export const managementOptions = [
  {
    method: "Browser Settings",
    description:
      "Most browsers allow you to manage cookies through their settings. Typically found under 'Privacy' or 'Security' sections.",
  },
  {
    method: "Opt-Out Tools",
    description:
      "Industry programs like the Digital Advertising Alliance provide tools to opt out of certain tracking cookies.",
  },
  {
    method: "Third-Party Controls",
    description: "Many third-party services offer their own opt-out mechanisms for their specific cookies.",
  },
  {
    method: "Our Cookie Banner",
    description: "When you first visit our site, you can manage your preferences through our cookie consent banner.",
  },
];
