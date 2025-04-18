"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => Promise<void>;
  language?: string;
  height?: string;
  loading?: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  onSave,
  language = "typescript",
  height = "500px",
  loading = false,
}) => {
  const [saving, setSaving] = useState(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      toast.success("File saved successfully");
    } catch (error) {
      console.error("Error saving file:", error);
      toast.error("Failed to save file");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="w-full mt-4 overflow-hidden border border-gray-200 dark:border-gray-800">
      <div className="h-[600px] w-full relative">
        <MonacoEditor
          height={height}
          language={language}
          theme="vs-dark"
          value={value}
          onChange={handleEditorChange}
          options={{
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            fontSize: 14,
            automaticLayout: true,
          }}
          loading={
            <div className="flex items-center justify-center h-full">
              Loading editor...
            </div>
          }
        />
        {(loading || saving) && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg">
              {saving ? "Saving..." : "Loading..."}
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-900">
        <Button
          onClick={handleSave}
          disabled={loading || saving}
          className="px-4 py-2"
        >
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  );
};

export default CodeEditor;
