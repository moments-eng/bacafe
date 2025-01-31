import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Img } from '@react-email/img';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import * as React from 'react';
import type { ReactElement } from 'react';
import { emailContent } from './locales/he';

export interface ApprovalEmailProps {
  username: string;
}

export default function ApprovalEmail({ username }: ApprovalEmailProps): ReactElement {
  const content = emailContent.approvalEmail;

  return (
    <Html dir="rtl" lang="he">
      <Head>
        <title>{content.subject}</title>
      </Head>
      <Section style={main}>
        <Container style={container}>
          <Img src="https://www.bapony.info/logo.png" width="100" height="100" alt="בול בפוני" style={logo} />

          <Text style={title}>{content.title}</Text>
          <Text style={greeting}>{content.greeting.replace('{username}', username)}</Text>
          <Text style={message}>{content.mainMessage}</Text>

          {content.description.map((desc, index) => (
            <Text key={index} style={paragraph}>
              {desc}
            </Text>
          ))}

          <Section style={featuresContainer}>
            {content.features.map((feature, index) => (
              <Text key={index} style={featureItem}>
                ✨ {feature}
              </Text>
            ))}
          </Section>

          <Button href="https://www.bapony.info/dashboard" style={button}>
            {content.cta}
          </Button>

          <Section style={footer}>
            <Text style={footerText}>{content.footer.needHelp}</Text>
            <Text style={footerContact}>{content.footer.contactUs}</Text>
            <Text style={footerSignature}>{content.footer.regards}</Text>
          </Section>
        </Container>
      </Section>
    </Html>
  );
}

const main = {
  backgroundColor: 'hsl(263, 30%, 98%)',
  fontFamily: 'Heebo, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
} as const;

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '414px',
} as const;

const logo = {
  margin: '0 auto 20px',
  display: 'block',
} as const;

const title = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: 'hsl(263, 25%, 20%)',
  margin: '0 0 10px',
  textAlign: 'center',
} as const;

const greeting = {
  fontSize: '24px',
  lineHeight: '1.4',
  fontWeight: '500',
  color: 'hsl(263, 25%, 20%)',
  margin: '0 0 20px',
  textAlign: 'center',
} as const;

const message = {
  fontSize: '18px',
  lineHeight: '1.5',
  color: 'hsl(263, 25%, 20%)',
  margin: '0 0 20px',
  textAlign: 'center',
} as const;

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: 'hsl(263, 25%, 40%)',
  margin: '0 0 10px',
  textAlign: 'right',
} as const;

const featuresContainer = {
  margin: '30px 0',
  padding: '20px',
  backgroundColor: 'hsl(263, 30%, 100%)',
  borderRadius: '8px',
  border: '1px solid hsl(263, 30%, 90%)',
} as const;

const featureItem = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: 'hsl(263, 25%, 20%)',
  margin: '0 0 10px',
  textAlign: 'right',
} as const;

const button = {
  backgroundColor: 'hsl(263, 85%, 60%)',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
  margin: '30px auto',
} as const;

const footer = {
  marginTop: '40px',
  textAlign: 'center' as const,
  borderTop: '1px solid hsl(263, 30%, 90%)',
  paddingTop: '20px',
} as const;

const footerText = {
  fontSize: '14px',
  color: 'hsl(263, 25%, 40%)',
  margin: '0 0 5px',
} as const;

const footerContact = {
  fontSize: '14px',
  color: 'hsl(263, 85%, 60%)',
  margin: '0 0 20px',
} as const;

const footerSignature = {
  fontSize: '14px',
  color: 'hsl(263, 25%, 20%)',
  fontWeight: '500',
  margin: '0',
} as const;
