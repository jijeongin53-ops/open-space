export async function uploadFileToDrive(file: File, folderId: string = '1g14VE3XHeR6zEO7Y7B8etWQ-4trcEFsY') {
  const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

  if (!scriptUrl) {
    throw new Error('GOOGLE_APPS_SCRIPT_URL is not configured in .env.local');
  }
  
  // Convert File to ArrayBuffer, then to Base64
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64Data = buffer.toString('base64');

  const payload = {
    action: 'upload',
    fileBase64: base64Data,
    fileName: file.name,
    mimeType: file.type,
    folderId: folderId,
  };

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        // Apps Script Web Apps often expect text/plain or application/json
        // CORS might block application/json from browser, but this is running on Node.js backend
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    
    if (!response.ok) {
      throw new Error(`Apps Script responded with ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to upload via Apps Script');
    }

    return result.url;
  } catch (error) {
    console.error('Error uploading file via Apps Script:', error);
    throw error;
  }
}
