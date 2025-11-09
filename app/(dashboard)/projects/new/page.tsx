"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, SaveIcon, DownloadIcon, Loader2Icon } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import JSZip from "jszip";

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

export default function NewProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 步骤1：项目描述
  const [description, setDescription] = useState("");

  // 步骤2：深入需求
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState("");

  // 步骤3：生成的文档
  const [documents, setDocuments] = useState<Documents | null>(null);
  const [previewMode, setPreviewMode] = useState<"markdown" | "html">("markdown");

  const progress = (currentStep / 3) * 100;

  // 步骤1：下一步
  const handleStep1Next = async () => {
    if (description.length < 20) {
      alert("项目描述至少需要 20 个字");
      return;
    }
    setCurrentStep(2);
    
    // 生成问题
    setLoading(true);
    try {
      const response = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });

      const data = await response.json();
      if (data.questions) {
        setQuestions(data.questions);
      } else {
        throw new Error("生成问题失败");
      }
    } catch (error) {
      console.error("生成问题失败:", error);
      alert("生成问题失败，请重试");
      setCurrentStep(1);
    } finally {
      setLoading(false);
    }
  };

  // 步骤2：下一步
  const handleStep2Next = async () => {
    if (!answers.trim()) {
      alert("请回答问题");
      return;
    }

    // 检查用户点数
    setLoading(true);
    try {
      const response = await fetch("/api/user/check-credits");
      const data = await response.json();

      if (!data.hasCredits) {
        const confirm = window.confirm("你没有足够的点数，是否前往充值？");
        if (confirm) {
          router.push("/pricing");
        }
        setLoading(false);
        return;
      }

      // 生成文档
      setCurrentStep(3);
      const docsResponse = await fetch("/api/ai/generate-documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, answers }),
      });

      const docsData = await docsResponse.json();
      if (docsData.documents) {
        setDocuments(docsData.documents);
      } else {
        throw new Error("生成文档失败");
      }
    } catch (error) {
      console.error("生成文档失败:", error);
      alert("生成文档失败，请重试");
      setCurrentStep(2);
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
    if (!documents) return;

    const zip = new JSZip();
    zip.file("用户旅程地图.md", documents.userJourney);
    zip.file("产品需求文档.md", documents.prd);
    zip.file("前端设计文档.md", documents.frontendDesign);
    zip.file("后端设计文档.md", documents.backendDesign);
    zip.file("数据库设计文档.md", documents.databaseDesign);

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "项目文档.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  // 保存项目
  const saveProject = async () => {
    if (!documents) return;

    const projectName = prompt("请输入项目名称:");
    if (!projectName) return;

    setSaving(true);
    try {
      const response = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          step1Description: description,
          step2Questions: questions,
          step2Answers: answers,
          step3Documents: documents,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("项目保存成功！");
        router.push(`/projects/${data.projectId}`);
      } else {
        throw new Error(data.error || "保存失败");
      }
    } catch (error) {
      console.error("保存项目失败:", error);
      alert("保存项目失败，请重试");
    } finally {
      setSaving(false);
    }
  };

  const documentTabs = documents ? [
    { label: "用户旅程地图", content: documents.userJourney, filename: "用户旅程地图" },
    { label: "产品需求 PRD", content: documents.prd, filename: "产品需求文档" },
    { label: "前端设计", content: documents.frontendDesign, filename: "前端设计文档" },
    { label: "后端设计", content: documents.backendDesign, filename: "后端设计文档" },
    { label: "数据库设计", content: documents.databaseDesign, filename: "数据库设计文档" },
  ] : [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">创建新项目</h1>
        <p className="text-muted-foreground mt-2">
          使用 AI Agent 辅助您完成专业的项目需求分析
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
            {currentStep === 3 && "创建文档"}
          </span>
        </div>
        <Progress value={progress} />
      </div>

      {/* 步骤1：描述项目 */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>步骤 1: 描述项目</CardTitle>
            <CardDescription>
              请详细描述你的项目，至少 20 个字
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="例如：我想开发一个在线教育平台，用户可以浏览课程、购买课程、在线学习。管理员可以管理课程内容、用户和订单..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={10}
              className="resize-none"
            />
            <div className="text-sm text-muted-foreground">
              当前字数: {description.length} / 20
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleStep1Next}
                disabled={description.length < 20}
                size="lg"
              >
                下一步 <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 步骤2：深入需求 */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>步骤 2: 深入需求</CardTitle>
            <CardDescription>
              AI 根据你的描述生成了以下问题，请详细回答
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">AI 正在生成问题...</span>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {questions.map((q, index) => (
                    <div key={index} className="border-l-4 border-primary pl-4">
                      <div className="font-medium">{index + 1}. {q.question}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        目的: {q.purpose}
                      </div>
                    </div>
                  ))}
                </div>

                <Textarea
                  placeholder="请在这里详细回答上述问题..."
                  value={answers}
                  onChange={(e) => setAnswers(e.target.value)}
                  rows={10}
                  className="resize-none"
                />

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    size="lg"
                  >
                    <ArrowLeftIcon className="mr-2 h-4 w-4" /> 上一步
                  </Button>
                  <Button
                    onClick={handleStep2Next}
                    disabled={!answers.trim() || loading}
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        下一步 <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* 步骤3：创建文档 */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>步骤 3: 创建文档</CardTitle>
            <CardDescription>
              AI 已为你生成专业的开发文档
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">AI 正在生成文档，这可能需要一些时间...</span>
              </div>
            ) : documents ? (
              <>
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

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    size="lg"
                  >
                    <ArrowLeftIcon className="mr-2 h-4 w-4" /> 上一步
                  </Button>
                  <Button
                    onClick={saveProject}
                    disabled={saving}
                    size="lg"
                  >
                    {saving ? (
                      <>
                        <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="mr-2 h-4 w-4" />
                        保存项目
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

