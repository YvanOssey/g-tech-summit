import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Outgoing e-mail through the SMTP server of the billetterie@ mailbox
 * (Hostinger). Settings live in server-only environment variables.
 */
function settings() {
  const host = process.env.SMTP_HOST?.trim();
  const port = Number(process.env.SMTP_PORT ?? 465);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS;
  const from = process.env.MAIL_FROM?.trim() || user;
  return host && user && pass && from ? { host, port, user, pass, from } : null;
}

export function isMailConfigured(): boolean {
  return settings() !== null;
}

let transport: Transporter | null = null;

function getTransport() {
  const s = settings();
  if (!s) throw new Error("[email] SMTP non configuré (voir .env.example)");
  transport ??= nodemailer.createTransport({
    host: s.host,
    port: s.port,
    // 465 = TLS from the start; 587 = STARTTLS, required.
    secure: s.port === 465,
    requireTLS: s.port !== 465,
    auth: { user: s.user, pass: s.pass },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 20_000,
  });
  return { transport, from: s.from };
}

export interface Mail {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

export async function sendMail(mail: Mail): Promise<void> {
  const { transport, from } = getTransport();
  await transport.sendMail({ from, ...mail });
}

/** Checks the connection and the credentials without sending anything. */
export async function verifyMailer(): Promise<void> {
  await getTransport().transport.verify();
}
