export async function sendEmailViaAppsScript(to: string, subject: string, body: string) {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    throw new Error('GOOGLE_APPS_SCRIPT_URL is not configured in .env.local');
  }

  const payload = {
    action: 'sendEmail',
    to,
    subject,
    body,
  };

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Apps Script responded with ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to send email via Apps Script');
    }

    return true;
  } catch (error) {
    console.error('Error sending email via Apps Script:', error);
    throw error;
  }
}
