import { Button } from '@react-email/button';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Section } from '@react-email/section';
import { Text } from '@react-email/text';
import * as React from 'react';
import type { FC } from 'react';

export interface WelcomeEmailProps {
  username: string;
}

const WelcomeEmail: FC<WelcomeEmailProps> = ({ username }) => {
  return (
    <Html>
      <Head />
      <Section style={main}>
        <Container>
          <Text style={heading}>Welcome to Moments, {username}! 👋</Text>
          <Text style={paragraph}>
            We're excited to have you on board. Get ready to discover and share amazing content.
          </Text>
          <Button href="https://your-app-url.com/dashboard" style={button}>
            Get Started
          </Button>
        </Container>
      </Section>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
} as const;

const heading = {
  fontSize: '32px',
  lineHeight: '1.3',
  fontWeight: '700',
  color: '#484848',
} as const;

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.4',
  color: '#484848',
} as const;

const button = {
  backgroundColor: '#5850EC',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
} as const;

export default WelcomeEmail;
