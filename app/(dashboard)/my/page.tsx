import { createClient } from "@/lib/supabase/server";
import { db, users, paymentHistory } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CreditCardIcon, CoinsIcon } from "lucide-react";

export default async function MyPage({
  searchParams,
}: {
  searchParams: Promise<{ payment?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // 获取或创建用户记录
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
  } else if (!dbUser.email && user.email) {
    // 更新邮箱
    [dbUser] = await db
      .update(users)
      .set({ email: user.email })
      .where(eq(users.id, user.id))
      .returning();
  }

  // 获取支付历史
  const payments = await db
    .select()
    .from(paymentHistory)
    .where(eq(paymentHistory.userId, user.id))
    .orderBy(desc(paymentHistory.createdAt))
    .limit(10);

  // Next.js 16: searchParams 是一个 Promise，需要 await
  const params = await searchParams;
  const paymentStatus = params.payment;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">我的</h1>
        <p className="text-muted-foreground mt-2">
          管理你的账户信息和点数
        </p>
      </div>

      {/* 支付状态提示 */}
      {paymentStatus === 'success' && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <p className="text-green-700 dark:text-green-300 font-medium">
              ✅ 支付成功！你的点数已充值。
            </p>
          </CardContent>
        </Card>
      )}
      {paymentStatus === 'failed' && (
        <Card className="border-red-500 bg-red-50 dark:bg-red-950">
          <CardContent className="pt-6">
            <p className="text-red-700 dark:text-red-300 font-medium">
              ❌ 支付失败，请重试。
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* 用户信息 */}
        <Card>
          <CardHeader>
            <CardTitle>账户信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">邮箱</div>
              <div className="font-medium">{dbUser.email}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">用户 ID</div>
              <div className="font-mono text-sm">{user.id}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">注册时间</div>
              <div>
                {new Date(dbUser.createdAt).toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 点数信息 */}
        <Card>
          <CardHeader>
            <CardTitle>项目点数</CardTitle>
            <CardDescription>
              每创建一个项目需要消耗 1 个点数
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CoinsIcon className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="text-4xl font-bold">{dbUser.credits}</div>
                <div className="text-sm text-muted-foreground">剩余点数</div>
              </div>
            </div>
            {dbUser.credits === 0 ? (
              <Link href="/pricing">
                <Button className="w-full" size="lg">
                  <CreditCardIcon className="mr-2 h-5 w-5" />
                  获取点数
                </Button>
              </Link>
            ) : (
              <Link href="/projects/new">
                <Button className="w-full" size="lg">
                  创建新项目
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 支付历史 */}
      <Card>
        <CardHeader>
          <CardTitle>支付历史</CardTitle>
          <CardDescription>
            查看你的充值记录
          </CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              暂无支付记录
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">时间</th>
                    <th className="text-left py-3 px-4">订单号</th>
                    <th className="text-right py-3 px-4">金额</th>
                    <th className="text-right py-3 px-4">点数</th>
                    <th className="text-center py-3 px-4">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="py-3 px-4">
                        {new Date(payment.createdAt).toLocaleDateString('zh-CN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">
                        {payment.orderNo}
                      </td>
                      <td className="text-right py-3 px-4">
                        ¥{parseFloat(payment.amount).toFixed(2)}
                      </td>
                      <td className="text-right py-3 px-4">
                        {payment.credits}
                      </td>
                      <td className="text-center py-3 px-4">
                        {payment.status === 'completed' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            已完成
                          </span>
                        )}
                        {payment.status === 'pending' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            待支付
                          </span>
                        )}
                        {payment.status === 'failed' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                            失败
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 使用提示 */}
      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• 每个项目点数可以创建一个完整的项目文档</p>
          <p>• 每个项目包含 5 份专业文档：用户旅程地图、PRD、前后端设计、数据库设计</p>
          <p>• 点数永久有效，无时间限制</p>
          <p>• 生成的文档支持 Markdown 和 HTML 预览</p>
          <p>• 支持单个文档下载或批量下载为 ZIP 包</p>
        </CardContent>
      </Card>
    </div>
  );
}

