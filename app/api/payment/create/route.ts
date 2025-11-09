import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createPaymentUrl, getPricingPlans } from '@/lib/payment/zpay';
import { db, paymentHistory } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // 验证用户登录
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const { planId } = await request.json();

    // 验证价格方案
    const plans = getPricingPlans();
    const plan = plans.find(p => p.id === planId);

    if (!plan) {
      return NextResponse.json(
        { error: '无效的价格方案' },
        { status: 400 }
      );
    }

    // 生成订单号
    const orderNo = `VG${Date.now()}${Math.random().toString(36).substring(2, 9)}`;

    // 创建支付记录
    await db.insert(paymentHistory).values({
      userId: user.id,
      orderNo,
      amount: plan.price.toString(),
      credits: plan.credits,
      status: 'pending',
    });

    // 创建支付链接
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const paymentUrl = createPaymentUrl({
      name: `VibeGuide ${plan.name}`,
      money: plan.price.toString(),
      type: 'alipay',
      out_trade_no: orderNo,
      notify_url: `${siteUrl}/api/payment/notify`,
      return_url: `${siteUrl}/api/payment/return`,
      param: user.id,
    });

    return NextResponse.json({ paymentUrl, orderNo });
  } catch (error) {
    console.error('创建支付订单失败:', error);
    return NextResponse.json(
      { error: '创建支付订单失败' },
      { status: 500 }
    );
  }
}

