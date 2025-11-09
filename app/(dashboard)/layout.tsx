import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileTextIcon, PlusCircleIcon, UserIcon, LogOutIcon } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* 顶部导航栏 */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/projects" className="text-2xl font-bold text-gradient hover:scale-105 transition-transform">
            VibeGuide
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* 侧边栏 */}
        <aside className="w-64 border-r min-h-[calc(100vh-4rem)] bg-muted/10 backdrop-blur-sm">
          <nav className="p-4 space-y-2">
            <Link href="/projects">
              <Button variant="ghost" className="w-full justify-start hover-lift group">
                <FileTextIcon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                我的项目
              </Button>
            </Link>
            <Link href="/projects/new">
              <Button variant="ghost" className="w-full justify-start hover-lift group">
                <PlusCircleIcon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                新建项目
              </Button>
            </Link>
            <Link href="/my">
              <Button variant="ghost" className="w-full justify-start hover-lift group">
                <UserIcon className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                我的
              </Button>
            </Link>
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 p-8 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

