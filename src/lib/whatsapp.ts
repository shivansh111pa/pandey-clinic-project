// WhatsApp Integration Utility
// Hybrid approach: WhatsApp Web links for MVP + pluggable API for future

/**
 * Generate a WhatsApp Web link that opens a chat with pre-filled message.
 * Works immediately without any API setup.
 */
export function generateWhatsAppLink(
  phone: string,
  message: string
): string {
  // Remove spaces, dashes, and ensure country code
  const cleanPhone = phone.replace(/[\s-()]/g, '').replace(/^0/, '91');
  const formattedPhone = cleanPhone.startsWith('+') ? cleanPhone.slice(1) : cleanPhone;
  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMessage}`;
}

/**
 * Generate a prescription sharing message for WhatsApp
 */
export function prescriptionWhatsAppMessage(
  patientName: string,
  doctorName: string,
  date: string
): string {
  return `Dear ${patientName},\n\nYour prescription from Dr. ${doctorName} (${date}) is ready.\n\nPlease download it from your Pandey Care patient portal.\n\nThank you for choosing Pandey Care! 🏥`;
}

/**
 * Generate a booking confirmation message for WhatsApp
 */
export function bookingWhatsAppMessage(
  patientName: string,
  date: string,
  time: string
): string {
  return `Dear ${patientName},\n\n✅ Your appointment has been confirmed!\n\n📅 Date: ${date}\n🕐 Time: ${time}\n👨‍⚕️ Doctor: Dr. Shivansh A. Pandey, MBBS\n📍 Location: AIIMS Gorakhpur\n\nPlease arrive 5 minutes early.\n\n— Pandey Care`;
}

// ─── Future API Integration (when Meta Business is set up) ───
/**
 * Send a message via WhatsApp Business Cloud API.
 * Requires WHATSAPP_PHONE_NUMBER_ID and WHATSAPP_ACCESS_TOKEN in env.
 */
export async function sendWhatsAppMessage(
  to: string,
  message: string
): Promise<boolean> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.log('[WhatsApp API] Not configured. Message would be sent to:', to);
    return false;
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/[^0-9]/g, ''),
          type: 'text',
          text: { body: message },
        }),
      }
    );
    return response.ok;
  } catch (error) {
    console.error('[WhatsApp API] Failed:', error);
    return false;
  }
}

/**
 * Send a PDF document via WhatsApp Business Cloud API
 */
export async function sendWhatsAppPDF(
  to: string,
  pdfBuffer: Buffer,
  filename: string,
  caption: string
): Promise<boolean> {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (!phoneNumberId || !accessToken) {
    console.log('[WhatsApp API] Not configured. PDF would be sent to:', to);
    return false;
  }

  try {
    // Step 1: Upload media
    const formData = new FormData();
    formData.append('file', new Blob([new Uint8Array(pdfBuffer)], { type: 'application/pdf' }), filename);
    formData.append('type', 'application/pdf');
    formData.append('messaging_product', 'whatsapp');

    const uploadRes = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/media`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: formData,
      }
    );
    const uploadData = await uploadRes.json();
    const mediaId = uploadData.id;

    // Step 2: Send document message
    const sendRes = await fetch(
      `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: to.replace(/[^0-9]/g, ''),
          type: 'document',
          document: {
            id: mediaId,
            caption,
            filename,
          },
        }),
      }
    );
    return sendRes.ok;
  } catch (error) {
    console.error('[WhatsApp API] PDF send failed:', error);
    return false;
  }
}
