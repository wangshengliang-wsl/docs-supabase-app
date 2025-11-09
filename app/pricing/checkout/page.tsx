import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db, paymentHistory, users } from "@/lib/db";
import { createPaymentUrl, getPricingPlans } from "@/lib/payment/zpay";
import { eq } from "drizzle-orm";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/pricing");
  }

  // Next.js 16: searchParams 是一个 Promise，需要 await
  const params = await searchParams;
  const planId = params.plan;
  
  if (!planId) {
    redirect("/pricing");
  }

  // 验证价格方案
  const plans = getPricingPlans();
  const plan = plans.find(p => p.id === planId);

  if (!plan) {
    redirect("/pricing?error=invalid_plan");
  }

  // 直接在服务器端创建支付订单
  try {
    // 确保用户在 users 表中存在
    let [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    if (!dbUser) {
      // 创建用户记录
      [dbUser] = await db
        .insert(users)
        .values({
          id: user.id,
          email: user.email || '',
          credits: 0,
        })
        .returning();
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

    // 跳转到支付页面
    redirect(paymentUrl);
  } catch (error) {
    // 如果是 NEXT_REDIRECT 错误，重新抛出以便正常重定向
    if (
      error instanceof Error && 
      (error.message === 'NEXT_REDIRECT' || 
       (error as any).digest?.startsWith('NEXT_REDIRECT'))
    ) {
      throw error;
    }
    
    console.error('创建支付失败:', error);
    redirect("/pricing?error=payment_failed");
  }
}

