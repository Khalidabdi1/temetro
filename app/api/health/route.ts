/**
 * Health Check API Route
 * 
 * GET /api/health
 * 
 * Returns server health status for monitoring and load balancers.
 * This is the simplest API route - no authentication required.
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
}
