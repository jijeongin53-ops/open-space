import { NextResponse } from 'next/server';
import { appendSheetData, getSheetData } from '@/lib/google-sheets';
import { sendEmailViaAppsScript } from '@/lib/apps-script';

export async function POST(request: Request) {
  try {
    const { placeId, proposerEmail, title, description, buildingName } = await request.json();

    if (!placeId || !proposerEmail || !title || !description) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 1. Save to Google Sheets
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const status = '검토중'; // Default status

    const row = [id, placeId, proposerEmail, title, description, status, createdAt];
    await appendSheetData('Events!A:G', [row]);

    // 2. Fetch Admin Email from Settings
    let adminEmail = '';
    try {
      const settingsRows = await getSheetData('Settings!A2:B'); // Skip header
      const adminEmailRow = settingsRows.find(r => r[0] === 'adminEmail');
      if (adminEmailRow && adminEmailRow[1]) {
        adminEmail = adminEmailRow[1];
      }
    } catch (e) {
      console.error('Error reading Settings sheet:', e);
    }

    // 3. Send Email Notification
    if (adminEmail) {
      const subject = `[공개공지 찾아라] 새로운 이벤트 제안이 등록되었습니다 (${buildingName})`;
      const body = `
        <h3>새로운 이벤트 제안이 접수되었습니다.</h3>
        <ul>
          <li><strong>대상 공개공지:</strong> ${buildingName}</li>
          <li><strong>제안자 이메일:</strong> ${proposerEmail}</li>
          <li><strong>이벤트 제목:</strong> ${title}</li>
        </ul>
        <p><strong>상세 내용:</strong></p>
        <p style="white-space: pre-wrap;">${description}</p>
        <hr />
        <p>구글 시트의 Events 탭에서 전체 내용을 확인하실 수 있습니다.</p>
      `;
      
      try {
        await sendEmailViaAppsScript(adminEmail, subject, body);
      } catch (e) {
        console.error('Failed to send email notification:', e);
        // Continue even if email fails, so user still gets success response for saving
      }
    } else {
      console.warn('Admin email not configured in Settings sheet. Skipping email notification.');
    }

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error('Error in /api/propose:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
