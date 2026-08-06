import { NextResponse } from 'next/server';
import { getGoogleSheetsClient, SPREADSHEET_ID } from '@/lib/google-sheets';

export async function GET() {
  try {
    const sheets = await getGoogleSheetsClient();
    let results = [];

    // 1. Add Events Tab
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: { requests: [{ addSheet: { properties: { title: 'Events' } } }] }
      });
      results.push('Events 탭 생성 완료.');
    } catch (e: any) {
      if (e.message.includes('already exists')) results.push('Events 탭 이미 존재.');
      else throw e;
    }

    // 2. Add Settings Tab
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: { requests: [{ addSheet: { properties: { title: 'Settings' } } }] }
      });
      results.push('Settings 탭 생성 완료.');
    } catch (e: any) {
      if (e.message.includes('already exists')) results.push('Settings 탭 이미 존재.');
      else throw e;
    }

    // 3. Set Headers for Events
    const eventHeaders = ['id', 'placeId', 'proposerEmail', 'title', 'description', 'status', 'createdAt'];
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Events!A1:G1',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [eventHeaders] }
    });

    // 4. Set Headers for Settings and default values
    const settingsData = [
      ['Key', 'Value', 'Description'],
      ['adminEmail', '', '지자체 담당자(수신자) 이메일 주소를 입력하세요.']
    ];
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Settings!A1:C2',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: settingsData }
    });

    return NextResponse.json({ success: true, message: '시트 세팅 완료!', results });
  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
