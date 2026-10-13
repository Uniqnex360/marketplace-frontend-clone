import React from "react";
import {
  Box,
  Container,
  Typography,
  Divider,
  Link,
  Stack,
  Chip,
} from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

const sections = [
  {
    title: "1. Information We Collect",
    content:
      "MarketLynxe may collect information such as your name, email address, account details, and information you provide while using our services. We may also collect basic device and usage information to improve our platform.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "We use your information to provide and maintain our services, manage your account, respond to support requests, improve user experience, maintain security, and comply with applicable legal obligations.",
  },
  {
    title: "3. Sharing of Information",
    content:
      "We do not share personal information except as necessary to operate our services, work with authorized service providers, comply with the law, or protect the rights and security of our users and platform.",
  },
  {
    title: "4. Cookies and Analytics",
    content:
      "Our website may use cookies and similar technologies to maintain functionality, remember preferences, understand usage, and improve performance. You can manage cookies through your browser settings and any controls we provide.",
  },
  {
    title: "5. Data Security",
    content:
      "We use reasonable technical and organizational measures designed to protect your personal information. However, no method of online transmission or electronic storage can be guaranteed to be completely secure.",
  },
  {
    title: "6. Data Retention",
    content:
      "We retain personal information only for as long as reasonably necessary for the purposes described in this policy, subject to applicable legal, accounting, security, and dispute-resolution requirements.",
  },
  {
    title: "7. Your Privacy Rights",
    content:
      "Depending on your location and applicable law, you may be able to request access to, correction of, or deletion of your personal information. Contact us to exercise your rights.",
  },
  {
    title: "8. Account Deletion",
    content:
      "You can request account deletion through our account deletion page. We may ask you to verify account ownership before processing your request. Certain information may need to be retained where required by law.",
  },
  {
    title: "9. Third-Party Services",
    content:
      "Our platform may use third-party services or link to external websites. Those services have their own privacy policies, and we encourage you to review them.",
  },
  {
    title: "10. Changes to This Policy",
    content:
      "We may update this Privacy Policy from time to time. Changes will be reflected on this page along with an updated revision date.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <Box sx={{ bgcolor: "#fff", minHeight: "100vh" }}>
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 9 } }}>
        {/* Header */}
        <Stack spacing={2} sx={{ mb: 5 }}>
          <Chip
            icon={<ShieldOutlinedIcon />}
            label="PRIVACY & SECURITY"
            sx={{
              alignSelf: "flex-start",
              bgcolor: "#f0efff",
              color: "#5145cd",
              fontWeight: 700,
              borderRadius: 1.5,
            }}
          />

          <Typography
            component="h1"
            sx={{
              fontSize: { xs: 34, md: 48 },
              fontWeight: 800,
              letterSpacing: "-1.5px",
              color: "#17213a",
            }}
          >
            Privacy Policy
          </Typography>

          <Typography
            sx={{
              color: "#667085",
              fontSize: 16,
              lineHeight: 1.8,
              maxWidth: 650,
            }}
          >
            Your privacy matters to us. This policy explains how MarketLynxe
            collects, uses, and protects your information when you use our
            platform.
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Last updated: October 13, 2026
          </Typography>
        </Stack>

        <Divider sx={{ mb: 4, borderColor: "#eaecf0" }} />

        {/* Introduction */}
        <Typography
          sx={{
            color: "#475467",
            fontSize: 15,
            lineHeight: 1.9,
            mb: 4,
          }}
        >
          This Privacy Policy applies to MarketLynxe and its associated
          services. By using our platform, you acknowledge that you have read
          this policy. Please review it carefully to understand our privacy
          practices.
        </Typography>

        {/* Policy Sections */}
        {sections.map((section, index) => (
          <Box key={section.title} sx={{ mb: 3.5 }}>
            <Typography
              component="h2"
              sx={{
                fontSize: 19,
                fontWeight: 700,
                color: "#17213a",
                mb: 1.2,
              }}
            >
              {section.title}
            </Typography>

            <Typography
              sx={{
                color: "#667085",
                fontSize: 14.5,
                lineHeight: 1.9,
              }}
            >
              {section.content}
            </Typography>

            {index !== sections.length - 1 && (
              <Divider sx={{ mt: 3, borderColor: "#f0f1f5" }} />
            )}
          </Box>
        ))}

        {/* Contact */}
        <Box
          sx={{
            mt: 5,
            p: { xs: 2.5, md: 3 },
            bgcolor: "#f8f9fc",
            borderRadius: 2,
            border: "1px solid #eaecf0",
          }}
        >
          <Typography
            component="h2"
            sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}
          >
            Questions about your privacy?
          </Typography>

          <Typography sx={{ color: "#667085", fontSize: 14, lineHeight: 1.8 }}>
            If you have questions about this policy or how your information is
            handled, contact us at{" "}
            <Link
              href="mailto:privacy@marketlynxe.com"
              underline="hover"
              sx={{ color: "#5145cd", fontWeight: 600 }}
            >
              privacy@marketlynxe.com
            </Link>
            .
          </Typography>
        </Box>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Link
            href="/account-deletion"
            underline="hover"
            sx={{ color: "#667085", fontSize: 13 }}
          >
            Account Deletion Request
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
