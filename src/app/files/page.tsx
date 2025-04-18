"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CodeEditor from "@/components/CodeEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "sonner";

interface AIFile {
  name: string;
}

interface I18nFile {
  language: string;
  filename: string;
}

interface FileData {
  ai: AIFile[];
  i18n: I18nFile[];
}

export default function FilesManager() {
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams.get("tab") as "ai" | "i18n" | null;

  const [fileData, setFileData] = useState<FileData | null>(null);
  const [activeTab, setActiveTab] = useState<"ai" | "i18n">(tabFromUrl || "ai");
  const [currentAIFile, setCurrentAIFile] = useState<string | null>(null);
  const [currentI18nFile, setCurrentI18nFile] = useState<{
    language: string;
    filename: string;
  } | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch file list on component mount
  useEffect(() => {
    fetchFileList();
  }, []);

  // Fetch initial content when current file changes
  useEffect(() => {
    if (currentAIFile && activeTab === "ai") {
      fetchAIFileContent(currentAIFile);
    } else if (currentI18nFile && activeTab === "i18n") {
      fetchI18nFileContent(currentI18nFile.language, currentI18nFile.filename);
    }
  }, [currentAIFile, currentI18nFile, activeTab]);

  const fetchFileList = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/files");
      const data = await response.json();
      setFileData(data);

      // Set default selected file if available
      if (data.ai && data.ai.length > 0) {
        setCurrentAIFile(data.ai[0]);
      }
      if (data.i18n && data.i18n.length > 0) {
        setCurrentI18nFile(data.i18n[0]);
      }
    } catch (error) {
      console.error("Error fetching file list:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIFileContent = async (filename: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/ai/${filename}`);
      const data = await response.json();
      setFileContent(data.content);
    } catch (error) {
      console.error("Error fetching AI file content:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchI18nFileContent = async (language: string, filename: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/i18n/${language}/${filename}`);
      const data = await response.json();
      setFileContent(data.content);
    } catch (error) {
      console.error("Error fetching i18n file content:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveCurrentFile = async () => {
    if (activeTab === "ai" && currentAIFile) {
      return saveAIFileContent(currentAIFile, fileContent);
    } else if (activeTab === "i18n" && currentI18nFile) {
      return saveI18nFileContent(
        currentI18nFile.language,
        currentI18nFile.filename,
        fileContent
      );
    }
  };

  const saveAIFileContent = async (filename: string, content: string) => {
    try {
      const response = await fetch(`/api/ai/${filename}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to save file");
      }
    } catch (error) {
      console.error("Error saving AI file:", error);
      throw error;
    }
  };

  const saveI18nFileContent = async (
    language: string,
    filename: string,
    content: string
  ) => {
    try {
      const response = await fetch(`/api/i18n/${language}/${filename}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to save file");
      }
    } catch (error) {
      console.error("Error saving i18n file:", error);
      throw error;
    }
  };

  const handleAIFileClick = (filename: string) => {
    if (currentAIFile !== filename) {
      setCurrentAIFile(filename);
    }
  };

  const handleI18nFileClick = (file: I18nFile) => {
    if (
      !currentI18nFile ||
      currentI18nFile.language !== file.language ||
      currentI18nFile.filename !== file.filename
    ) {
      setCurrentI18nFile(file);
    }
  };

  const getFileLanguage = (filename: string) => {
    const extension = filename.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "ts":
      case "tsx":
        return "typescript";
      case "js":
      case "jsx":
        return "javascript";
      case "json":
        return "json";
      default:
        return "typescript";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            File Management Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="ai"
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "ai" | "i18n")}
          >
            <TabsList className="mb-4">
              <TabsTrigger value="ai">AI Files</TabsTrigger>
              <TabsTrigger value="i18n">i18n Files</TabsTrigger>
            </TabsList>

            <TabsContent value="ai" className="space-y-4">
              {fileData?.ai && fileData.ai.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-wrap gap-2">
                    {fileData.ai.map((file) => (
                      <Button
                        key={file}
                        variant={currentAIFile === file ? "default" : "outline"}
                        onClick={() => handleAIFileClick(file)}
                      >
                        {file}
                      </Button>
                    ))}
                  </div>

                  {currentAIFile && (
                    <div className="mt-4">
                      <h3 className="text-xl font-medium mb-2">
                        Editing:{" "}
                        <span className="font-bold">{currentAIFile}</span>
                      </h3>
                      <CodeEditor
                        value={fileContent}
                        onChange={setFileContent}
                        onSave={saveCurrentFile}
                        language={getFileLanguage(currentAIFile)}
                        loading={loading}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  {loading ? "Loading files..." : "No AI files found"}
                </div>
              )}
            </TabsContent>

            <TabsContent value="i18n" className="space-y-4">
              {fileData?.i18n && fileData.i18n.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-wrap gap-2">
                    {fileData.i18n.map((file, index) => (
                      <Button
                        key={`${file.language}-${file.filename}-${index}`}
                        variant={
                          currentI18nFile &&
                          currentI18nFile.language === file.language &&
                          currentI18nFile.filename === file.filename
                            ? "default"
                            : "outline"
                        }
                        onClick={() => handleI18nFileClick(file)}
                      >
                        {file.language}/{file.filename}
                      </Button>
                    ))}
                  </div>

                  {currentI18nFile && (
                    <div className="mt-4">
                      <h3 className="text-xl font-medium mb-2">
                        Editing:{" "}
                        <span className="font-bold">{`${currentI18nFile.language}/${currentI18nFile.filename}`}</span>
                      </h3>
                      <CodeEditor
                        value={fileContent}
                        onChange={setFileContent}
                        onSave={saveCurrentFile}
                        language={getFileLanguage(currentI18nFile.filename)}
                        loading={loading}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  {loading ? "Loading files..." : "No i18n files found"}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Toaster position="bottom-right" />
    </div>
  );
}
