import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, phone, service, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailSubject = subject || `[Demande de Devis] ${service || "Général"} - ${name}`;

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: "nexoralabsjhn1@gmail.com",
      replyTo: email,
      subject: mailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 25px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #00A3FF; margin-bottom: 20px; border-bottom: 2px solid #00A3FF; padding-bottom: 10px;">
            Nouvelle demande reçue depuis le site
          </h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #555; font-weight: bold; width: 160px;">Nom complet :</td>
              <td style="padding: 8px 0; color: #111;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #555; font-weight: bold;">Adresse Email :</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #00A3FF; text-decoration: none;">${email}</a></td>
            </tr>
            ${
              phone
                ? `<tr>
                    <td style="padding: 8px 0; color: #555; font-weight: bold;">Téléphone / WhatsApp :</td>
                    <td style="padding: 8px 0; color: #111;"><a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}" style="color: #25D366; font-weight: bold;">${phone} (Ouvrir WhatsApp)</a></td>
                  </tr>`
                : ""
            }
            ${
              service
                ? `<tr>
                    <td style="padding: 8px 0; color: #555; font-weight: bold;">Service demandé :</td>
                    <td style="padding: 8px 0; color: #111; font-weight: bold;">${service}</td>
                  </tr>`
                : ""
            }
          </table>

          <div style="margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #00A3FF; border-radius: 4px;">
            <p style="margin: 0 0 8px 0; font-weight: bold; color: #333;">Détails / Message :</p>
            <p style="margin: 0; color: #555; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "Email envoyé avec succès !" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    return NextResponse.json({ error: "Une erreur est survenue lors de l'envoi du message." }, { status: 500 });
  }
}