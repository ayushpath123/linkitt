import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';


export async function POST(req: Request) {
  const body = await req.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ message: 'Email is required' }, { status: 400 });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Store the OTP (in production, store it in a persistent storage like a database or Redis)
  // Set up Nodemailer transport using environment variables
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service provider
    auth: {
      user: process.env.SMTP_USER, // Set in your environment variables
      pass: process.env.SMTP_PASS, // Set in your environment variables
    },
  });

  // Send OTP email
  try {
    await transporter.sendMail({
      from: `"LinkIt" <${process.env.SMTP_USER}>`, // Use SMTP_USER as the sender email
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}`,
    });

    return NextResponse.json({ message: 'OTP sent',otp:otp }, { status: 200 });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ message: 'Error sending OTP' }, { status: 500 });
  }
}
