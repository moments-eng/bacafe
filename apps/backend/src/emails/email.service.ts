import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import type { ReactElement } from 'react';

export interface SendEmailOptions {
  to: string;
  subject: string;
  react: ReactElement;
  from?: string;
}

@Injectable()
export class EmailService {
  private readonly defaultFromEmail: string;

  constructor(
    private readonly resend: Resend,
    private readonly configService: ConfigService,
  ) {
    this.defaultFromEmail = this.configService.get<string>('RESEND_FROM_EMAIL') || 'onboarding@resend.dev';
  }

  /**
   * Sends an email using Resend
   * @param options The email options including recipient, subject, and React template
   * @returns A promise that resolves with the send result
   */
  public async sendEmail(options: SendEmailOptions) {
    console.log('Sending email', options);
    return this.resend.emails.send({
      from: 'Team Bapony <team@bapony.info>',
      to: options.to,
      subject: options.subject,
      react: options.react,
    });
  }

  /**
   * Gets the default from email address configured for the email service
   * @returns The default from email address
   */
  public getDefaultFromEmail(): string {
    return this.defaultFromEmail;
  }
}
