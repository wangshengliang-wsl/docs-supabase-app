import { NextRequest, NextResponse } from 'next/server';
import { verifySign, getCreditsFromAmount } from '@/lib/payment/zpay';
import { db, paymentHistory, users } from '@/lib/db';
import { eq } from 'drizzle-orm';

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
      console.error('签名验证失败:', params);
      return new NextResponse('fail', { status: 400 });
    }

    // 检查支付状态
    if (params.trade_status !== 'TRADE_SUCCESS') {
      return new NextResponse('success', { status: 200 });
    }

    const { out_trade_no, trade_no, money, param: userId } = params;

    // 查询支付记录
    const [payment] = await db
      .select()
      .from(paymentHistory)
      .where(eq(paymentHistory.orderNo, out_trade_no))
      .limit(1);

    if (!payment) {
      console.error('支付记录不存在:', out_trade_no);
      return new NextResponse('fail', { status: 400 });
    }

    // 防止重复处理
    if (payment.status === 'completed') {
      return new NextResponse('success', { status: 200 });
    }

    // 验证金额
    const expectedAmount = parseFloat(payment.amount);
    const actualAmount = parseFloat(money);
    if (Math.abs(expectedAmount - actualAmount) > 0.01) {
      console.error('金额不匹配:', { expected: expectedAmount, actual: actualAmount });
      return new NextResponse('fail', { status: 400 });
    }

    // 更新支付记录
    await db
      .update(paymentHistory)
      .set({
        status: 'completed',
        tradeNo: trade_no,
        paidAt: new Date(),
      })
      .where(eq(paymentHistory.id, payment.id));

    // 增加用户点数
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user) {
      await db
        .update(users)
        .set({
          credits: user.credits + payment.credits,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } else {
      // 如果用户不存在，创建用户记录
      await db.insert(users).values({
        id: userId,
        email: '', // 将在用户登录后更新
        credits: payment.credits,
      });
    }

    return new NextResponse('success', { status: 200 });
  } catch (error) {
    console.error('支付回调处理失败:', error);
    return new NextResponse('fail', { status: 500 });
  }
}

