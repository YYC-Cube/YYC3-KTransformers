import { NextRequest, NextResponse } from 'next/server';

/**
 * 系统健康检查API端点
 * GET /api/health
 *
 * 返回系统和环境状态
 */
export async function GET(_request: NextRequest) {
  try {
    // 检查请求时间
    const startTime = Date.now();

    // 环境变量检查
    const envChecks = {
      bigmodelApiKey: !!process.env['NEXT_PUBLIC_BIGMODEL_API_KEY'],
      aiApiUrl: !!process.env['NEXT_PUBLIC_AI_API_URL'],
      appUrl: !!process.env['NEXT_PUBLIC_APP_URL'],
      databaseUrl: !!process.env['DATABASE_URL'],
    };

    const allEnvConfigured = Object.values(envChecks).every(Boolean);

    // 系统信息
    const systemInfo = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      platform: process.platform,
      nodeVersion: process.version,
      environment: process.env['NEXT_PUBLIC_ENVIRONMENT'] || 'unknown',
    };

    // 功能开关状态
    const features = {
      aiChat: process.env['NEXT_PUBLIC_ENABLE_AI_CHAT'] === 'true',
      pwa: process.env['NEXT_PUBLIC_ENABLE_PWA'] === 'true',
      realtime: process.env['NEXT_PUBLIC_ENABLE_REALTIME'] === 'true',
      animations: process.env['NEXT_PUBLIC_ENABLE_ANIMATIONS'] === 'true',
      voiceChat: process.env['NEXT_PUBLIC_ENABLE_VOICE_CHAT'] === 'true',
      emotionAnalysis: process.env['NEXT_PUBLIC_ENABLE_EMOTION_ANALYSIS'] === 'true',
    };

    // 响应时间
    const responseTime = Date.now() - startTime;

    // 构建响应
    const healthData = {
      ...systemInfo,
      environment: {
        configured: allEnvConfigured,
        checks: envChecks,
      },
      features,
      performance: {
        responseTimeMs: responseTime,
      },
      endpoints: {
        aiChat: '/api/ai/chat',
        emotionAnalysis: '/api/ai/emotion',
        growthRecords: '/api/growth-records',
        children: '/api/children',
      },
    };

    // 根据健康状态返回相应HTTP状态码
    const statusCode = allEnvConfigured ? 200 : 503;

    return NextResponse.json(healthData, {
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    // 错误处理
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
    });
  }
}

/**
 * OPTIONS方法用于CORS预检请求
 */
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
