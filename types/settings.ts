
export interface SmtpConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  encryption: 'tls' | 'ssl';
  fromAddress: string;
  fromName: string;
}

export interface AdminEmail {
  email: string;
  name: string;
  isActive: boolean;
}

export interface EmailSettings {
  smtp: SmtpConfig;
  adminEmails: AdminEmail[];
}

export interface WebsiteSettings {
  emailSettings: EmailSettings;
}

export interface DemoRequestData {
  companyName: string;
  contactPersonName: string;
  companySize: string;
  whatsapp: string;
  industry: string;
  message?: string;
}