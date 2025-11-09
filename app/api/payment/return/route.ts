import { NextRequest, NextResponse } from 'next/server';
import { verifySign } from '@/lib/payment/zpay';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params: Record<string, string> = {};

    // 提取所有参数
    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    // 验证签名
    if (!verifySign(params)) {
      return NextResponse.redirect(new URL('/my?payment=failed', request.url));
    }

    // 检查支付状态
    if (params.trade_status === 'TRADE_SUCCESS') {
      return NextResponse.redirect(new URL('/my?payment=success', request.url));
    }

    return NextResponse.redirect(new URL('/my?payment=pending', request.url));
  } catch (error) {
    console.error('支付跳转处理失败:', error);
    return NextResponse.redirect(new URL('/my?payment=error', request.url));
  }
}

