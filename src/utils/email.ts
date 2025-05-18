import { Resend } from 'resend';
import { PasswordResetEmail } from '../../emails';
import { renderAsync } from '@react-email/components';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetLink: string
) {
  try {
    // Render the React email component to HTML
    const html = await renderAsync(
      PasswordResetEmail({
        username: name,
        resetLink,
      })
    );

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'Citizen Engagement System <onboarding@resend.dev>',
      to: email,
      subject: 'Reset Your Citizen Engagement System Password',
      html,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error);
    return { success: false, error };
  }
} 