import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
//import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com', // e.g., 'smtp.gmail.com' for Gmail
      port:587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {

      try {
        const email =this.transporter.sendMail({
          from: process.env.EMAIL_USER,
          to,
          subject,
          html,
        });
        
      if (email){
        return true;
      }
        return false;
      } catch (error) {
          throw error
      } 

    
  }
}
