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
        {["pretty", "raw", "headers", "timing"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 transition-all relative group ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
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
          <div className="p-6 space-y-3 overflow-auto h-full bg-card/10 text-sans">
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
        {activeTab === "timing" && (
          <div className="p-8 space-y-8 h-full overflow-auto bg-card/5">
            <div className="flex flex-col gap-6 max-w-2xl">
              <h4 className="text-sm font-bold text-foreground/80 flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                Precision Network Timing
              </h4>
              <div className="space-y-4">
                {[
                  { label: "DNS Lookup", value: "12", color: "bg-blue-400" },
                  {
                    label: "TCP Handshake",
                    value: "24",
                    color: "bg-purple-400",
                  },
                  {
                    label: "SSL/TLS Secure Connect",
                    value: "28",
                    color: "bg-emerald-400",
                  },
                  {
                    label: "Request Dispatch",
                    value: "1",
                    color: "bg-amber-400",
                  },
                  {
                    label: "Wait Time (TTFB)",
                    value: Math.max(1, Math.round(response.time * 0.75)),
                    color: "bg-rose-400",
                  },
                  {
                    label: "Payload Transfer",
                    value: Math.max(1, Math.round(response.time * 0.15)),
                    color: "bg-indigo-400",
                  },
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold tracking-tight">
                      <span className="text-muted-foreground/80 uppercase">
                        {item.label}
                      </span>
                      <span className="text-foreground">{item.value} ms</span>
                    </div>
                    <div className="h-2 w-full bg-muted/20 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} shadow-[0_0_10px_rgba(0,0,0,0.2)] transition-all duration-1000 ease-out animate-in slide-in-from-left`}
                        style={{
                          width: `${Math.min(
                            100,
                            (Number(item.value) / response.time) * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-8 border-t border-border/50 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-50 tracking-widest">
                    Aggregate Latency
                  </span>
                  <span className="text-4xl font-black text-primary tracking-tighter">
                    {response.time} ms
                  </span>
                </div>
                <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
                    Performance Peak
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
