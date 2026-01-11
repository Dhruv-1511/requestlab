import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Copy, Check } from "lucide-react";
import { Button } from "./ui/Button";

export const ResponsePanel = ({ response }) => {
  const [activeTab, setActiveTab] = useState("pretty");
  const [copied, setCopied] = useState(false);

  if (!response) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-accent/30 p-8">
        <p className="text-lg font-medium">No response yet</p>
        <p className="text-sm">Enter a URL and click send to see results</p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return "text-green-500";
    if (status >= 400) return "text-red-500";
    if (status >= 300) return "text-yellow-500";
    return "text-muted-foreground";
  };

  return (
    <div className="flex flex-col h-full bg-background border-t">
      {/* STATUS BAR */}
      <div className="flex items-center justify-between p-3 border-b text-xs font-medium">
        <div className="flex gap-4">
          <div className="flex gap-1">
            <span className="text-muted-foreground">Status:</span>
            <span className={getStatusColor(response.status)}>
              {response.status} {response.statusText}
            </span>
          </div>
          <div className="flex gap-1">
            <span className="text-muted-foreground">Time:</span>
            <span className="text-green-500">{response.time} ms</span>
          </div>
          <div className="flex gap-1">
            <span className="text-muted-foreground">Size:</span>
            <span className="text-green-500">
              {(response.size / 1024).toFixed(2)} KB
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 gap-2"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy Response"}
        </Button>
      </div>

      {/* TABS */}
      <div className="flex border-b text-xs">
        {["pretty", "raw", "headers"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 capitalize transition-colors border-b-2 font-medium ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent hover:text-primary/70"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "pretty" && (
          <Editor
            height="100%"
            defaultLanguage="json"
            theme="vs-dark"
            value={
              typeof response.data === "string"
                ? response.data
                : JSON.stringify(response.data, null, 2)
            }
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 13,
              wordWrap: "on",
            }}
          />
        )}
        {activeTab === "raw" && (
          <pre className="p-4 text-xs font-mono whitespace-pre-wrap h-full overflow-auto bg-card">
            {typeof response.data === "string"
              ? response.data
              : JSON.stringify(response.data)}
          </pre>
        )}
        {activeTab === "headers" && (
          <div className="p-4 space-y-2 overflow-auto h-full">
            {Object.entries(response.headers).map(([key, value]) => (
              <div
                key={key}
                className="flex gap-4 border-b border-muted pb-1 text-sm"
              >
                <span className="font-semibold w-1/3 truncate text-muted-foreground">
                  {key}
                </span>
                <span className="flex-1 break-all font-mono text-xs">
                  {value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
