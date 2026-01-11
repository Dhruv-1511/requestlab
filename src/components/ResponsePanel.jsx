import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Copy, Check } from "lucide-react";
import { Button } from "./ui/Button";

export const ResponsePanel = ({ response }) => {
  const [activeTab, setActiveTab] = useState("pretty");
  const [copied, setCopied] = useState(false);

  if (!response) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-background/50 p-8 font-sans">
        <div className="w-20 h-20 mb-6 opacity-20 relative">
          <img
            src="/src/assets/logo.png"
            alt=""
            className="w-full h-full object-contain grayscale"
          />
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
        </div>
        <p className="text-xl font-extrabold tracking-widest text-foreground/40 uppercase">
          Ready for Request
        </p>
        <p className="text-xs font-semibold tracking-tight mt-2 max-w-[200px] text-center opacity-60">
          Configure your request and hit Send to see the magic happen.
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300)
      return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (status >= 400) return "text-rose-400 bg-rose-500/10 border-rose-500/20";
    if (status >= 300)
      return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-muted-foreground bg-muted/10 border-muted/20";
  };

  return (
    <div className="flex flex-col h-full bg-background/40">
      {/* STATUS BAR */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-card/20 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase">
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/60">Status:</span>
            <span
              className={`px-2 py-0.5 rounded-md border ${getStatusColor(
                response.status
              )}`}
            >
              {response.status} {response.statusText}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/60">Time:</span>
            <span className="text-primary">{response.time} ms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground/60">Size:</span>
            <span className="text-secondary">
              {(response.size / 1024).toFixed(2)} KB
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-7 gap-2 text-[9px] hover:bg-primary/10 transition-colors"
        >
          {copied ? (
            <Check size={14} className="text-emerald-500" />
          ) : (
            <Copy size={14} />
          )}
          {copied ? "Copied!" : "Copy Raw"}
        </Button>
      </div>

      {/* TABS */}
      <div className="flex px-4 border-b bg-background/10 text-[10px] font-bold tracking-[0.1em] uppercase">
        {["pretty", "raw", "headers"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 transition-all relative group ${
              activeTab === tab
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 brand-gradient glow-primary" />
            )}
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
              padding: { top: 16 },
              backgroundColor: "transparent",
            }}
          />
        )}
        {activeTab === "raw" && (
          <pre className="p-6 text-xs font-mono whitespace-pre-wrap h-full overflow-auto bg-card/10 selection:bg-primary/30">
            {typeof response.data === "string"
              ? response.data
              : JSON.stringify(response.data)}
          </pre>
        )}
        {activeTab === "headers" && (
          <div className="p-6 space-y-3 overflow-auto h-full bg-card/10">
            {Object.entries(response.headers).map(([key, value]) => (
              <div
                key={key}
                className="flex gap-4 border-b border-primary/5 pb-2 text-sm group"
              >
                <span className="font-bold w-1/3 truncate text-muted-foreground/70 group-hover:text-primary transition-colors">
                  {key}
                </span>
                <span className="flex-1 break-all font-mono text-xs opacity-80">
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
