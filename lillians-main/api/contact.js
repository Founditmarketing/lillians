const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, phone, service, message } = req.body;

    // Basic server-side validation
    if (!name || !email || !message || !service) {
        return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    // Format service label for the email body
    const serviceLabels = {
        installation: 'Wallpaper Installation',
        murals: 'Custom Murals',
        removal: 'Wallpaper Removal',
        consultation: 'Consultation',
        commercial: 'Commercial Project',
        other: 'Other',
    };
    const serviceLabel = serviceLabels[service] || service;

    try {
        await resend.emails.send({
            from: 'Lillian\'s Interiors <hello@lilliansinteriors.com>',
            to: ['Lillian@LilliansInteriors.com'],
            replyTo: email,
            subject: `New Project Inquiry from ${name} — ${serviceLabel}`,
            html: `
                <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #2a2018;">
                    <div style="background: #f5ede0; padding: 32px 40px; border-bottom: 3px solid #c9a97a;">
                        <h1 style="margin: 0; font-size: 24px; color: #2a2018; font-weight: normal; letter-spacing: 0.05em;">
                            New Project Inquiry
                        </h1>
                        <p style="margin: 8px 0 0; color: #8a6a4a; font-size: 14px;">
                            Lillian's Interiors — Contact Form
                        </p>
                    </div>

                    <div style="padding: 32px 40px; background: #fff;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0e8dc; width: 140px;">
                                    <strong style="color: #8a6a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Name</strong>
                                </td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0e8dc; color: #2a2018;">
                                    ${name}
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0e8dc;">
                                    <strong style="color: #8a6a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Email</strong>
                                </td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0e8dc; color: #2a2018;">
                                    <a href="mailto:${email}" style="color: #c9a97a; text-decoration: none;">${email}</a>
                                </td>
                            </tr>
                            ${phone ? `
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0e8dc;">
                                    <strong style="color: #8a6a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Phone</strong>
                                </td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0e8dc; color: #2a2018;">
                                    <a href="tel:${phone}" style="color: #c9a97a; text-decoration: none;">${phone}</a>
                                </td>
                            </tr>` : ''}
                            <tr>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0e8dc;">
                                    <strong style="color: #8a6a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em;">Service</strong>
                                </td>
                                <td style="padding: 12px 0; border-bottom: 1px solid #f0e8dc; color: #2a2018;">
                                    ${serviceLabel}
                                </td>
                            </tr>
                        </table>

                        <div style="margin-top: 28px;">
                            <strong style="color: #8a6a4a; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 12px;">
                                Message
                            </strong>
                            <p style="margin: 0; color: #2a2018; line-height: 1.7; background: #faf6f0; padding: 20px; border-left: 3px solid #c9a97a;">
                                ${message.replace(/\n/g, '<br>')}
                            </p>
                        </div>

                        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #f0e8dc;">
                            <p style="margin: 0; font-size: 13px; color: #8a6a4a;">
                                Reply directly to this email to respond to ${name}.
                            </p>
                        </div>
                    </div>

                    <div style="background: #2a2018; padding: 20px 40px; text-align: center;">
                        <p style="margin: 0; color: #c9a97a; font-size: 12px; letter-spacing: 0.08em;">
                            LILLIAN'S INTERIORS · NASHVILLE, TN · 615.354.3000
                        </p>
                    </div>
                </div>
            `,
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('Resend error:', error);
        return res.status(500).json({ error: 'Failed to send message. Please try again or call us directly.' });
    }
};
