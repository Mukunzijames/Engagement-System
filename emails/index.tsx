import {
  Body,
  Column,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface PasswordResetEmailProps {
  username?: string;
  resetLink?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const PasswordResetEmail = ({
  username = '',
  resetLink = 'https://example.com/reset-password',
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Reset your Citizen Engagement System password</Preview>
        <Container style={container}>
          <Section style={logo}>
            <div style={logoContainer}>
              <Text style={logoText}>CES</Text>
            </div>
          </Section>
          <Section style={sectionsBorders}>
            <Row>
              <Column style={sectionBorder} />
              <Column style={sectionCenter} />
              <Column style={sectionBorder} />
            </Row>
          </Section>
          <Section style={content}>
            <Text style={paragraph}>Hi {username},</Text>
            <Text style={paragraph}>
              You recently requested to reset your password for your Citizen Engagement System account. 
              Use the button below to reset it. This password reset link is only valid for the next 30 minutes.
            </Text>
            <Section style={buttonContainer}>
              <Link href={resetLink} style={button}>
                Reset your password
              </Link>
            </Section>
            <Text style={paragraph}>
              If you did not request a password reset, please ignore this email or contact support if you have questions.
            </Text>
            <Text style={paragraph}>
              If you're having trouble clicking the password reset button, copy and paste the URL below into your web browser:
            </Text>
            <Text style={link}>{resetLink}</Text>
            <Text style={paragraph}>
              Thanks,
              <br />
              Citizen Engagement System Support Team
            </Text>
          </Section>
        </Container>

        <Section style={footer}>
          <Row>
            <Text style={{ textAlign: 'center', color: '#706a7b' }}>
              © 2025 Citizen Engagement System, All Rights Reserved <br />
              Kigali/Rwanda
            </Text>
          </Row>
        </Section>
      </Body>
    </Html>
  );
};

PasswordResetEmail.PreviewProps = {
  username: 'Citizen',
  resetLink: 'https://example.com/reset-password?token=123456789',
} as PasswordResetEmailProps;

export default PasswordResetEmail;

const fontFamily = 'HelveticaNeue,Helvetica,Arial,sans-serif';

const main = {
  backgroundColor: '#efeef1',
  fontFamily,
};

const paragraph = {
  lineHeight: 1.5,
  fontSize: 14,
};

const container = {
  maxWidth: '580px',
  margin: '30px auto',
  backgroundColor: '#ffffff',
};

const footer = {
  maxWidth: '580px',
  margin: '0 auto',
};

const content = {
  padding: '5px 20px 10px 20px',
};

const logo = {
  padding: 30,
  textAlign: 'center' as const,
};

const logoContainer = {
  display: 'inline-block',
  padding: '16px',
  backgroundColor: '#FCB045',
  borderRadius: '8px',
};

const logoText = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#FFFFFF',
  margin: '0',
};

const sectionsBorders = {
  width: '100%',
};

const sectionBorder = {
  borderBottom: '1px solid rgb(238,238,238)',
  width: '249px',
};

const sectionCenter = {
  borderBottom: '1px solid #FCB045',
  width: '102px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
};

const button = {
  backgroundColor: '#FCB045',
  borderRadius: '4px',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 20px',
};

const link = {
  color: '#2754C5',
  textDecoration: 'underline',
  margin: '12px 0 24px',
  display: 'block',
  overflowWrap: 'break-word' as const,
  fontSize: '12px',
};
