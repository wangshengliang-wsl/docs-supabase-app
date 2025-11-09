import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckIcon, FileTextIcon, SparklesIcon, ZapIcon, ShieldIcon, ClockIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  async function handleGetStarted() {
    "use server";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      redirect("/projects");
    } else {
      redirect("/auth/login");
    }
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

      {/* Hero 区域 */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              AI 驱动的智能
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                {" "}开发文档平台
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              VibeGuide 帮助编程新手和团队快速生成专业的项目开发文档，包括用户旅程地图、PRD、技术设计文档等，让项目规划更简单高效。
            </p>
          </div>
          <div className="flex items-center justify-center gap-4">
            <form action={handleGetStarted}>
              <Button size="lg" className="text-lg px-8">
                立即开始 <SparklesIcon className="ml-2 h-5 w-5" />
              </Button>
            </form>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-lg px-8">
                查看价格
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features 区域 */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">强大的功能特性</h2>
            <p className="text-xl text-muted-foreground">
              使用 AI 技术，让文档生成变得前所未有的简单
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-2">
                  <SparklesIcon className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>AI 智能生成</CardTitle>
                <CardDescription>
                  基于 Claude 4 模型，智能分析需求，生成专业的开发文档
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-2">
                  <FileTextIcon className="h-6 w-6 text-violet-500" />
                </div>
                <CardTitle>全面的文档类型</CardTitle>
                <CardDescription>
                  支持用户旅程地图、PRD、前后端设计、数据库设计等多种文档
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-2">
                  <ZapIcon className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle>快速高效</CardTitle>
                <CardDescription>
                  几分钟内完成需要数小时甚至数天的文档编写工作
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-500/10 flex items-center justify-center mb-2">
                  <ClockIcon className="h-6 w-6 text-orange-500" />
                </div>
                <CardTitle>随时访问</CardTitle>
                <CardDescription>
                  云端保存，随时随地访问和下载你的项目文档
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-pink-500/10 flex items-center justify-center mb-2">
                  <ShieldIcon className="h-6 w-6 text-pink-500" />
                </div>
                <CardTitle>安全可靠</CardTitle>
                <CardDescription>
                  企业级数据安全保障，你的项目信息完全私密
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-2">
                  <CheckIcon className="h-6 w-6 text-cyan-500" />
                </div>
                <CardTitle>灵活导出</CardTitle>
                <CardDescription>
                  支持 Markdown 和 HTML 预览，可单个或批量下载为 ZIP
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats 区域 */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-muted-foreground">活跃用户</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5000+</div>
              <div className="text-muted-foreground">生成文档</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">用户满意度</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing 预览 */}
      <section className="container mx-auto px-4 py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">简单透明的价格</h2>
            <p className="text-xl text-muted-foreground">
              按需购买，无订阅费用
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>基础版</CardTitle>
                <div className="text-3xl font-bold mt-2">¥20</div>
                <CardDescription>10 个项目点数</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span>生成 10 个项目文档</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span>所有文档类型</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span>云端保存</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle>专业版</CardTitle>
                <div className="text-3xl font-bold mt-2">¥40</div>
                <CardDescription>30 个项目点数</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span>生成 30 个项目文档</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span>所有文档类型</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span>云端保存</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span className="font-semibold">更高性价比</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing">
              <Button size="lg">查看详细价格</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">常见问题</h2>
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>什么是项目点数？</CardTitle>
                <CardDescription>
                  每创建并保存一个项目需要消耗 1 个点数。点数购买后永久有效，没有时间限制。
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>生成的文档质量如何？</CardTitle>
                <CardDescription>
                  我们使用最先进的 Claude 4 AI 模型，可以生成专业级的开发文档。文档内容详实，结构清晰，可直接用于项目开发。
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>可以修改生成的文档吗？</CardTitle>
                <CardDescription>
                  当然可以！生成的文档支持 Markdown 格式下载，你可以使用任何文本编辑器进行修改。
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>数据安全吗？</CardTitle>
                <CardDescription>
                  我们使用 Supabase 提供的企业级数据库服务，所有数据都经过加密存储。你的项目信息完全私密，只有你可以访问。
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-blue-600 to-violet-600">
        <div className="max-w-4xl mx-auto text-center space-y-6 text-white">
          <h2 className="text-3xl md:text-4xl font-bold">
            准备好开始你的项目了吗？
          </h2>
          <p className="text-xl opacity-90">
            立即注册，体验 AI 驱动的智能文档生成
          </p>
          <form action={handleGetStarted}>
            <Button size="lg" variant="secondary" className="text-lg px-8">
              免费开始 <SparklesIcon className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
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
