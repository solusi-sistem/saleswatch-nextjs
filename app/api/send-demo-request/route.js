import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { companyName, contactPersonName, companySize, whatsapp, industry, message } = await request.json();

    if (!companyName || !contactPersonName || !companySize || !whatsapp || !industry) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi kecuali pesan' },
        { status: 400 }
      );
    }

    const requiredEnvs = [
      'MAIL_HOST',
      'MAIL_PORT', 
      'MAIL_USERNAME',
      'MAIL_PASSWORD',
      'MAIL_FROM_ADDRESS'
    ];

    for (const env of requiredEnvs) {
      if (!process.env[env]) {
        return NextResponse.json(
          { error: `Konfigurasi email tidak lengkap: ${env}` },
          { status: 500 }
        );
      }
    }

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      secure: process.env.MAIL_PORT === '465',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true,
      logger: true
    });

    try {
      await transporter.verify();
    } catch (verifyError) {
      return NextResponse.json(
        { error: 'Koneksi email server gagal: ' + verifyError.message },
        { status: 500 }
      );
    }

    const timestamp = new Date().toLocaleString('id-ID', {
      timeZone: 'Asia/Jakarta',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const mailOptions = {
      from: `"${process.env.MAIL_FROM_NAME || 'Saleswatch'}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: 'saleswatchid@gmail.com',
      subject: `📋 Demo Request Baru - ${companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Demo Request</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 20px;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #6587A8;">
              <h1 style="color: #061551; margin: 0; font-size: 28px;">Saleswatch</h1>
              <p style="color: #6587A8; margin: 5px 0 0 0; font-size: 16px; font-weight: 600;">Demo Request Notification</p>
            </div>
            
            <!-- Alert Box -->
            <div style="background: linear-gradient(135deg, #6587A8 0%, #4A6FA5 100%); border-radius: 12px; padding: 20px; margin-bottom: 30px; text-align: center;">
              <p style="color: white; margin: 0; font-size: 18px; font-weight: bold;">
                🎯 Permintaan Demo Baru Masuk!
              </p>
              <p style="color: #CFE3C0; margin: 10px 0 0 0; font-size: 14px;">
                ${timestamp}
              </p>
            </div>

            <!-- Company Information -->
            <div style="background-color: #f8f9fa; border-left: 4px solid #6587A8; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
              <h3 style="color: #061551; margin: 0 0 15px 0; font-size: 18px;">
                📊 Informasi Perusahaan
              </h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #5B5B5C; font-size: 14px; width: 40%;">
                    <strong>Nama Perusahaan:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #2f2e2e; font-size: 14px;">
                    ${companyName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5B5B5C; font-size: 14px;">
                    <strong>Ukuran Perusahaan:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #2f2e2e; font-size: 14px;">
                    ${companySize}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5B5B5C; font-size: 14px;">
                    <strong>Industri:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #2f2e2e; font-size: 14px;">
                    ${industry}
                  </td>
                </tr>
              </table>
            </div>

            <!-- Contact Information -->
            <div style="background-color: #f8f9fa; border-left: 4px solid #CFE3C0; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
              <h3 style="color: #061551; margin: 0 0 15px 0; font-size: 18px;">
                👤 Informasi Kontak
              </h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #5B5B5C; font-size: 14px; width: 40%;">
                    <strong>Nama:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #2f2e2e; font-size: 14px;">
                    ${contactPersonName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #5B5B5C; font-size: 14px;">
                    <strong>WhatsApp:</strong>
                  </td>
                  <td style="padding: 8px 0; color: #2f2e2e; font-size: 14px;">
                    <a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}" style="color: #25D366; text-decoration: none;">
                      ${whatsapp}
                    </a>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Message Section -->
            ${message ? `
            <div style="background-color: #fff9e6; border-left: 4px solid #ffc107; padding: 20px; margin-bottom: 20px; border-radius: 8px;">
              <h3 style="color: #061551; margin: 0 0 15px 0; font-size: 18px;">
                💬 Pesan dari Klien
              </h3>
              <p style="color: #5B5B5C; margin: 0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                ${message}
              </p>
            </div>
            ` : ''}

            <!-- Action Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}" 
                 style="display: inline-block; background: linear-gradient(135deg, #6587A8 0%, #4A6FA5 100%); 
                        color: white; padding: 15px 40px; text-decoration: none; border-radius: 50px; 
                        font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(101, 135, 168, 0.3);">
                💬 Hubungi via WhatsApp
              </a>
            </div>

            <!-- Footer -->
            <div style="border-top: 2px solid #e9ecef; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                Email ini dikirim otomatis dari sistem Saleswatch
              </p>
              <p style="color: #999; font-size: 12px; margin: 10px 0 0 0;">
                © ${new Date().getFullYear()} Saleswatch. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        DEMO REQUEST BARU - SALESWATCH
        ================================
        
        Waktu: ${timestamp}
        
        INFORMASI PERUSAHAAN:
        - Nama Perusahaan: ${companyName}
        - Ukuran Perusahaan: ${companySize}
        - Industri: ${industry}
        
        INFORMASI KONTAK:
        - Nama: ${contactPersonName}
        - WhatsApp: ${whatsapp}
        
        ${message ? `PESAN:\n${message}\n` : ''}
        
        Hubungi via WhatsApp: https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { 
        success: true,
        message: 'Demo request berhasil dikirim',
        messageId: info.messageId 
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Gagal mengirim demo request',
        details: error.message,
        code: error.code || 'UNKNOWN_ERROR'
      },
      { status: 500 }
    );
  }
}