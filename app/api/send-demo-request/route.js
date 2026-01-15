import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const body = await request.json();
    const { companyName, contactPersonName, companySize, whatsapp, industry, message } = body;

    console.log('📧 Demo Request received:', { companyName, contactPersonName, companySize, whatsapp, industry });

    // Validasi input
    if (!companyName || !contactPersonName || !companySize || !whatsapp || !industry) {
      console.error('❌ Validation failed: Missing required fields');
      return NextResponse.json(
        { error: 'Semua field wajib diisi kecuali pesan' },
        { status: 400 }
      );
    }

    // Fetch settings dari Sanity
    console.log('🔍 Fetching settings from Sanity...');
    const settingsUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/settings`;
    console.log('📍 Settings URL:', settingsUrl);
    
    const settingsResponse = await fetch(settingsUrl, { 
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('📥 Settings response status:', settingsResponse.status);

    if (!settingsResponse.ok) {
      const errorText = await settingsResponse.text();
      console.error('❌ Failed to fetch settings:', errorText);
      return NextResponse.json(
        { 
          error: 'Gagal mengambil konfigurasi email dari Sanity. Pastikan Website Settings sudah diisi di Sanity Studio.',
          details: errorText
        },
        { status: 500 }
      );
    }

    const settings = await settingsResponse.json();
    console.log('✅ Settings fetched successfully');
    console.log('📧 SMTP Config:', {
      host: settings.emailSettings?.smtp?.host,
      port: settings.emailSettings?.smtp?.port,
      username: settings.emailSettings?.smtp?.username,
      fromAddress: settings.emailSettings?.smtp?.fromAddress,
    });
    console.log('👥 Admin Emails:', settings.emailSettings?.adminEmails);
    
    // Validasi settings
    if (!settings.emailSettings?.smtp) {
      console.error('❌ SMTP configuration not found in settings');
      return NextResponse.json(
        { error: 'Konfigurasi SMTP tidak ditemukan. Silakan isi Website Settings di Sanity Studio.' },
        { status: 500 }
      );
    }

    const { smtp, adminEmails } = settings.emailSettings;

    // Validasi admin emails
    if (!adminEmails || adminEmails.length === 0) {
      console.error('❌ No active admin emails found');
      return NextResponse.json(
        { error: 'Tidak ada email admin yang aktif. Silakan tambahkan admin email di Website Settings.' },
        { status: 500 }
      );
    }

    console.log('📧 Admin emails found:', adminEmails.map(a => `${a.name} <${a.email}>`));

    // Konfigurasi transporter
    console.log('🔧 Configuring SMTP transporter...');
    console.log('🔑 Using SMTP:', {
      host: smtp.host,
      port: smtp.port,
      user: smtp.username,
      secure: smtp.port === 465,
    });

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.port === 465, // true untuk port 465, false untuk port lainnya
      auth: {
        user: smtp.username,
        pass: smtp.password,
      },
      tls: {
        rejectUnauthorized: false
      },
      debug: true, // Enable debug output
      logger: true // Log information to console
    });

    // Verify koneksi SMTP
    try {
      console.log('🔍 Verifying SMTP connection...');
      await transporter.verify();
      console.log('✅ SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('❌ SMTP Verification Error:', verifyError);
      console.error('Error details:', {
        message: verifyError.message,
        code: verifyError.code,
        command: verifyError.command
      });
      return NextResponse.json(
        { 
          error: 'Koneksi ke server email gagal. Periksa konfigurasi SMTP di Sanity.', 
          details: verifyError.message,
          code: verifyError.code
        },
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

    // Siapkan list penerima
    const recipients = adminEmails.map(admin => admin.email).join(', ');
    console.log('📬 Sending to recipients:', recipients);

    const mailOptions = {
      from: `"${smtp.fromName || 'Saleswatch'}" <${smtp.fromAddress}>`,
      to: recipients,
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
              <p style="color: #999; font-size: 12px; margin: 5px 0 0 0;">
                Dikirim ke: ${adminEmails.map(admin => admin.name).join(', ')}
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
        
        ---
        Dikirim ke: ${adminEmails.map(admin => `${admin.name} (${admin.email})`).join(', ')}
      `,
    };

    console.log('📤 Attempting to send email...');
    console.log('From:', mailOptions.from);
    console.log('To:', mailOptions.to);
    console.log('Subject:', mailOptions.subject);

    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    console.log('📬 Sent to:', adminEmails.map(a => a.email).join(', '));

    return NextResponse.json(
      { 
        success: true,
        message: 'Demo request berhasil dikirim',
        messageId: info.messageId,
        sentTo: adminEmails.length,
        recipients: adminEmails.map(a => a.email)
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Send Email Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
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