import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Calculation } from '@/entities/Calculation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { calculationId } = body;

    if (!calculationId) {
      return NextResponse.json(
        { error: 'calculationId is required' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);

    const calculation = await repo.findOne({ where: { id: calculationId } });

    if (!calculation) {
      return NextResponse.json(
        { error: 'Calculation not found' },
        { status: 404 }
      );
    }

    calculation.shared = true;
    await repo.save(calculation);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shareUrl = `${appUrl}/?calc=${calculationId}&expr=${encodeURIComponent(calculation.expression)}&result=${encodeURIComponent(calculation.result)}`;

    return NextResponse.json({
      data: {
        shareUrl,
        calculationId: calculation.id,
      },
    });
  } catch (error) {
    console.error('POST /api/share error:', error);
    return NextResponse.json(
      { error: 'Failed to share calculation' },
      { status: 500 }
    );
  }
}
