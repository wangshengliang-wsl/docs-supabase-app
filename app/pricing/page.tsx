import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  async function handlePurchase(planId: string) {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      redirect("/auth/login?redirect=/pricing");
    }
    
    // 创建支付订单并跳转
    redirect(`/pricing/checkout?plan=${planId}`);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* 导航栏 */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              VibeGuide
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
                首页
              </Link>
              <Link href="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
                价格
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/projects">
                <Button>进入控制台</Button>
              </Link>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">登录</Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button>注册</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* 价格内容 */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl md:text-5xl font-bold">
              选择适合你的
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {" "}价格方案
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              简单透明的定价，按需购买，无订阅费用。点数永久有效，随时使用。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* 基础版 */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">基础版</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">¥20</span>
                </div>
                <CardDescription className="text-base mt-2">
                  10 个项目点数
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">生成 10 个项目文档</div>
                      <div className="text-sm text-muted-foreground">每个项目包含 5 份完整文档</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">所有文档类型</div>
                      <div className="text-sm text-muted-foreground">用户旅程、PRD、前后端设计、数据库设计</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">云端保存</div>
                      <div className="text-sm text-muted-foreground">随时访问和下载你的项目</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">Markdown 导出</div>
                      <div className="text-sm text-muted-foreground">单个或批量下载为 ZIP</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">点数永久有效</div>
                      <div className="text-sm text-muted-foreground">无时间限制</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <form action={handlePurchase.bind(null, "basic")} className="w-full">
                  <Button size="lg" variant="outline" className="w-full">
                    购买基础版
                  </Button>
                </form>
              </CardFooter>
            </Card>

            {/* 专业版 */}
            <Card className="relative border-primary shadow-lg">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  推荐
                </span>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">专业版</CardTitle>
                <div className="mt-4">
                  <span className="text-5xl font-bold">¥40</span>
                </div>
                <CardDescription className="text-base mt-2">
                  30 个项目点数
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">生成 30 个项目文档</div>
                      <div className="text-sm text-muted-foreground">每个项目包含 5 份完整文档</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">所有文档类型</div>
                      <div className="text-sm text-muted-foreground">用户旅程、PRD、前后端设计、数据库设计</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">云端保存</div>
                      <div className="text-sm text-muted-foreground">随时访问和下载你的项目</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">Markdown 导出</div>
                      <div className="text-sm text-muted-foreground">单个或批量下载为 ZIP</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium">点数永久有效</div>
                      <div className="text-sm text-muted-foreground">无时间限制</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-medium text-primary">更高性价比</div>
                      <div className="text-sm text-muted-foreground">平均每个项目仅 ¥1.33</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <form action={handlePurchase.bind(null, "pro")} className="w-full">
                  <Button size="lg" className="w-full">
                    购买专业版
                  </Button>
                </form>
              </CardFooter>
            </Card>
          </div>

          {/* 对比表格 */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-center mb-8">功能对比</h2>
            <div className="overflow-x-auto">
              <table className="w-full max-w-3xl mx-auto">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4">功能</th>
                    <th className="text-center py-4 px-4">基础版</th>
                    <th className="text-center py-4 px-4">专业版</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-4 px-4">项目点数</td>
                    <td className="text-center py-4 px-4">10</td>
                    <td className="text-center py-4 px-4 font-semibold">30</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">价格</td>
                    <td className="text-center py-4 px-4">¥20</td>
                    <td className="text-center py-4 px-4">¥40</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">单个项目成本</td>
                    <td className="text-center py-4 px-4">¥2</td>
                    <td className="text-center py-4 px-4 font-semibold text-primary">¥1.33</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">AI 文档生成</td>
                    <td className="text-center py-4 px-4"><CheckIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><CheckIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">云端保存</td>
                    <td className="text-center py-4 px-4"><CheckIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><CheckIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-4 px-4">文档导出</td>
                    <td className="text-center py-4 px-4"><CheckIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                    <td className="text-center py-4 px-4"><CheckIcon className="h-5 w-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="py-4 px-4">点数有效期</td>
                    <td className="text-center py-4 px-4">永久</td>
                    <td className="text-center py-4 px-4">永久</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-center mb-8">常见问题</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">如何支付？</CardTitle>
                  <CardDescription>
                    我们支持支付宝和微信支付。点击购买按钮后，系统会跳转到支付页面，选择你喜欢的支付方式即可。
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">点数会过期吗？</CardTitle>
                  <CardDescription>
                    不会！购买的点数永久有效，没有任何时间限制。你可以随时使用。
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">可以退款吗？</CardTitle>
                  <CardDescription>
                    如果你购买后未使用任何点数，可以在 7 天内申请全额退款。使用过点数后不支持退款。
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">可以升级套餐吗？</CardTitle>
                  <CardDescription>
                    当然可以！你可以随时购买更多点数。不同套餐的点数会累加到你的账户中。
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 VibeGuide. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                首页
              </Link>
              <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">
                价格
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

