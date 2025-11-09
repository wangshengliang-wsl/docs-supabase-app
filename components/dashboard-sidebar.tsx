"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  FileTextIcon, 
  PlusCircleIcon, 
  UserIcon, 
  MenuIcon,
  ChevronLeftIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // 键盘快捷键支持 (Ctrl+B 或 Cmd+B)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsCollapsed(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    {
      href: "/projects",
      icon: FileTextIcon,
      label: "我的项目",
    },
    {
      href: "/projects/new",
      icon: PlusCircleIcon,
      label: "新建项目",
    },
    {
      href: "/my",
      icon: UserIcon,
      label: "我的",
    },
  ];

  return (
    <aside 
      className={cn(
        "border-r min-h-[calc(100vh-4rem)] bg-muted/10 backdrop-blur-sm transition-all duration-300 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo 区域 */}
      <div className={cn(
        "p-6 border-b flex items-center",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <Link href="/projects" className="text-2xl font-bold text-gradient hover:scale-105 transition-transform">
            VibeGuide
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hover-lift"
        >
          {isCollapsed ? (
            <MenuIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* 导航菜单 */}
      <nav className="p-4 space-y-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || 
            (item.href === "/projects" && pathname.startsWith("/projects") && pathname !== "/projects/new");
          
          return (
            <Link key={item.href} href={item.href}>
              <Button 
                variant={isActive ? "default" : "ghost"} 
                className={cn(
                  "w-full hover-lift group transition-all",
                  isCollapsed ? "justify-center px-2" : "justify-start px-4",
                  isActive && "glow"
                )}
                size={isCollapsed ? "icon" : "default"}
              >
                <Icon className={cn(
                  "group-hover:scale-110 transition-transform flex-shrink-0",
                  isCollapsed ? "h-6 w-6" : "h-5 w-5"
                )} />
                {!isCollapsed && (
                  <span className="ml-3 text-base">{item.label}</span>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* 底部提示 */}
      {!isCollapsed && (
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground text-center">
            <p>快捷键提示</p>
            <p className="mt-1">按 <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground bg-muted border rounded">Ctrl+B</kbd> 切换侧边栏</p>
          </div>
        </div>
      )}
    </aside>
  );
}

