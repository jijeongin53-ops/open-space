import { NextResponse } from 'next/server';
import { getSheetData } from '@/lib/google-sheets';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await getSheetData('Checklists!A2:AI'); // Skip header row
    
    const places = rows.map((row: any[]) => {
      // row indices based on setup-sheet.js and our recent lat/lon addition
      // 0: id, 2: buildingName, 3: address, 27: photo1, 28: photo2, 
      // 29: idea1, 30: idea2, 31: idea3, 33: lat, 34: lon
      
      const lat = parseFloat(row[33]);
      const lon = parseFloat(row[34]);

      return {
        id: row[0] || '',
        buildingName: row[2] || '',
        address: row[3] || '',
        photo1: row[27] || '',
        photo2: row[28] || '',
        idea1: row[29] || '',
        idea2: row[30] || '',
        idea3: row[31] || '',
        lat: isNaN(lat) ? null : lat,
        lon: isNaN(lon) ? null : lon,
      };
    }).filter((place: any) => place.lat !== null && place.lon !== null); // Filter out rows without coordinates

    return NextResponse.json({ success: true, places });
  } catch (error: any) {
    console.error('Error fetching places:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
