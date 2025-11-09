import { createClient } from "@/lib/supabase/server";
import { db, projects } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircleIcon, FileTextIcon } from "lucide-react";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // 获取用户的所有项目
  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, user.id))
    .orderBy(desc(projects.createdAt));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">我的项目</h1>
          <p className="text-muted-foreground mt-2">
            管理和查看你的所有项目文档
          </p>
        </div>
        <Link href="/projects/new">
          <Button size="lg">
            <PlusCircleIcon className="mr-2 h-5 w-5" />
            新建项目
          </Button>
        </Link>
      </div>

      {userProjects.length === 0 ? (
        <Card className="p-12">
          <div className="text-center space-y-4">
            <FileTextIcon className="h-16 w-16 mx-auto text-muted-foreground" />
            <h3 className="text-xl font-semibold">还没有项目</h3>
            <p className="text-muted-foreground">
              创建你的第一个项目，开始使用 AI 生成开发文档
            </p>
            <Link href="/projects/new">
              <Button size="lg">
                <PlusCircleIcon className="mr-2 h-5 w-5" />
                新建项目
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="h-full hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="line-clamp-2">{project.name}</CardTitle>
                  <CardDescription>
                    创建于 {new Date(project.createdAt).toLocaleDateString('zh-CN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </CardDescription>
                  {project.step1Description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">
                      {project.step1Description}
                    </p>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

