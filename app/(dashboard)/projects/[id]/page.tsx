"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeftIcon, DownloadIcon, Loader2Icon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import JSZip from "jszip";
import Link from "next/link";

interface Question {
  question: string;
  purpose: string;
}

interface Documents {
  userJourney: string;
  prd: string;
  frontendDesign: string;
  backendDesign: string;
  databaseDesign: string;
}

interface Project {
  id: string;
  name: string;
  step1Description: string;
  step2Questions: Question[];
  step2Answers: string;
  step3Documents: Documents;
  createdAt: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState<"markdown" | "html">("markdown");
  const [currentStep, setCurrentStep] = useState(1);

  const progress = (currentStep / 3) * 100;

  useEffect(() => {
    fetchProject();
  }, [params.id]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
        setCurrentStep(3); // 默认显示文档
      } else {
        alert("项目不存在");
        router.push("/projects");
      }
    } catch (error) {
      console.error("加载项目失败:", error);
      alert("加载项目失败");
    } finally {
      setLoading(false);
    }
  };

  // 下载单个文档
  const downloadDocument = (name: string, content: string) => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 批量下载为 ZIP
  const downloadAllDocuments = async () => {
    if (!project?.step3Documents) return;

    const docs = project.step3Documents;
    const zip = new JSZip();
    zip.file("用户旅程地图.md", docs.userJourney);
    zip.file("产品需求文档.md", docs.prd);
    zip.file("前端设计文档.md", docs.frontendDesign);
    zip.file("后端设计文档.md", docs.backendDesign);
    zip.file("数据库设计文档.md", docs.databaseDesign);

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name}.zip`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const documentTabs = [
    { label: "用户旅程地图", content: project.step3Documents.userJourney, filename: "用户旅程地图" },
    { label: "产品需求 PRD", content: project.step3Documents.prd, filename: "产品需求文档" },
    { label: "前端设计", content: project.step3Documents.frontendDesign, filename: "前端设计文档" },
    { label: "后端设计", content: project.step3Documents.backendDesign, filename: "后端设计文档" },
    { label: "数据库设计", content: project.step3Documents.databaseDesign, filename: "数据库设计文档" },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/projects">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            返回项目列表
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-muted-foreground mt-2">
          创建于 {new Date(project.createdAt).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* 步骤进度条 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">
            步骤 {currentStep} / 3
          </span>
          <span className="text-sm text-muted-foreground">
            {currentStep === 1 && "描述项目"}
            {currentStep === 2 && "深入需求"}
            {currentStep === 3 && "项目文档"}
          </span>
        </div>
        <Progress value={progress} />
        <div className="flex gap-2 mt-4">
          <Button
            variant={currentStep === 1 ? "default" : "outline"}
            onClick={() => setCurrentStep(1)}
            size="sm"
          >
            项目描述
          </Button>
          <Button
            variant={currentStep === 2 ? "default" : "outline"}
            onClick={() => setCurrentStep(2)}
            size="sm"
          >
            深入需求
          </Button>
          <Button
            variant={currentStep === 3 ? "default" : "outline"}
            onClick={() => setCurrentStep(3)}
            size="sm"
          >
            项目文档
          </Button>
        </div>
      </div>

      {/* 步骤1：项目描述 */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>项目描述</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap bg-muted/30 p-4 rounded">
              {project.step1Description}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 步骤2：深入需求 */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>需求问答</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-4">AI 生成的问题</h3>
              <div className="space-y-4">
                {project.step2Questions.map((q, index) => (
                  <div key={index} className="border-l-4 border-primary pl-4">
                    <div className="font-medium">{index + 1}. {q.question}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      目的: {q.purpose}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">你的回答</h3>
              <div className="whitespace-pre-wrap bg-muted/30 p-4 rounded">
                {project.step2Answers}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 步骤3：项目文档 */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>项目文档</CardTitle>
            <CardDescription>
              查看和下载生成的开发文档
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === "markdown" ? "default" : "outline"}
                  onClick={() => setPreviewMode("markdown")}
                  size="sm"
                >
                  Markdown
                </Button>
                <Button
                  variant={previewMode === "html" ? "default" : "outline"}
                  onClick={() => setPreviewMode("html")}
                  size="sm"
                >
                  预览
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={downloadAllDocuments}
                  size="sm"
                >
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  批量下载 ZIP
                </Button>
              </div>
            </div>

            <Tabs defaultValue="0" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {documentTabs.map((tab, index) => (
                  <TabsTrigger key={index} value={index.toString()}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {documentTabs.map((tab, index) => (
                <TabsContent key={index} value={index.toString()}>
                  <div className="border rounded-lg p-6 bg-muted/30">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{tab.label}</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadDocument(tab.filename, tab.content)}
                      >
                        <DownloadIcon className="mr-2 h-4 w-4" />
                        下载
                      </Button>
                    </div>
                    <div className="max-h-[600px] overflow-y-auto">
                      {previewMode === "markdown" ? (
                        <pre className="whitespace-pre-wrap font-mono text-sm bg-background p-4 rounded">
                          {tab.content}
                        </pre>
                      ) : (
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {tab.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

