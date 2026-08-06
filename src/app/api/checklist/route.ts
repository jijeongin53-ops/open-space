import { NextResponse } from 'next/server';
import { appendSheetData } from '@/lib/google-sheets';
import { uploadFileToDrive } from '@/lib/google-drive';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};
    
    // Parse form data
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Skip files in the initial data mapping, we'll handle them separately
      } else {
        data[key] = value.toString();
      }
    }

    const lat = formData.get('lat') as string || '';
    const lon = formData.get('lon') as string || '';
    
    // Upload photos if they exist
    let photo1Url = '';
    let photo2Url = '';
    
    const photo1 = formData.get('photo1');
    if (photo1 instanceof File && photo1.size > 0) {
      photo1Url = await uploadFileToDrive(photo1) || '';
    }
    
    const photo2 = formData.get('photo2');
    if (photo2 instanceof File && photo2.size > 0) {
      photo2Url = await uploadFileToDrive(photo2) || '';
    }
    
    const row = [
      data.id || crypto.randomUUID(),
      data.investigator || '',
      data.buildingName || '',
      data.address || '',
      data.area || '',
      data.type || '',
      data.q_access_1 || '', data.q_access_2 || '', data.q_access_3 || '', data.q_access_4 || '', data.q_access_5 || '',
      data.q_safety_1 || '', data.q_safety_2 || '', data.q_safety_3 || '', data.q_safety_4 || '', data.q_safety_5 || '',
      data.q_activity_1 || '', data.q_activity_2 || '', data.q_activity_3 || '', data.q_activity_4 || '',
      data.q_identity_1 || '', data.q_identity_2 || '', data.q_identity_3 || '',
      data.q_sustainability_1 || '', data.q_sustainability_2 || '', data.q_sustainability_3 || '', data.q_sustainability_4 || '',
      photo1Url, photo2Url,
      data.idea1 || '', data.idea2 || '', data.idea3 || '',
      new Date().toISOString(),
      lat,
      lon
    ];

    await appendSheetData('Checklists!A:AI', [row]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving checklist:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
