import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
import Client from 'mailgun.js/dist/lib/client';
import { BadRequestException } from '@src/libs/exceptions';

@Injectable()
export class MailgunClient {
  private client: Client;
  private domain: string;
  constructor(private readonly configService: ConfigService) {
    const Mailgun = require('mailgun.js');
    const formData = require('form-data');

    const mailgun = new Mailgun(formData);
    this.client = mailgun.client({
      username: 'api',
      key: configService.get('mailgunSecretKey') || 'MAILGUN_SECRET_KEY',
    });
    this.domain = configService.get('mailgunDomain');
  }

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    templateVariables: { [key: string]: string },
  ) {
    const mailgunData = {
      from: this.configService.get('emailFrom'),
      to,
      subject,
      template,
      'h:X-Mailgun-Variables': JSON.stringify(templateVariables),
      'h:Reply-To': this.configService.get('emailFrom'),
    };

    try {
      const response = await this.client.messages.create(
        this.domain,
        mailgunData,
      );

      return response;
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err.message);
    }
  }
}
