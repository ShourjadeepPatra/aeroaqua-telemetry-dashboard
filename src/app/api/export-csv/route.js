import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const logs = await request.json();
    const headers = 'Timestamp,Temperature_C,DO_mgL,pH,Turbidity_NTU,WQI,Pump_Status\n';
    const rows = logs
      .map(
        (l) =>
          `${l.timestamp},${l.temperature},${l.estimatedDO},${l.ph},${l.turbidity},${l.wqi},${l.pumpStatus}`
      )
      .join('\n');

    const csvContent = headers + rows;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="PMMSY_Proof_of_Loss_Report.csv"',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate CSV' }, { status: 500 });
  }
}