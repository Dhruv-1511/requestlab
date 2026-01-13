import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Send,
  Loader2,
  Save,
  Trash2,
  Plus,
  Folder,
  LayoutTemplate,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { useRequestStore } from "../store/useRequestStore";
import { useEnvStore } from "../store/useEnvStore";
import { prepareRequest } from "../utils/resolver";
import { parseCurl } from "../utils/curlParser";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import RequestTemplates from "./RequestTemplates";

const METHODS = [
  { value: "GET", label: "GET" },
  { value: "POST", label: "POST" },
  { value: "PUT", label: "PUT" },
  { value: "PATCH", label: "PATCH" },
  { value: "DELETE", label: "DELETE" },
];

export const RequestPanel = ({ onResponse }) => {
  const { currentRequest, updateCurrentRequest, saveRequest, addToHistory } =
    useRequestStore();
  const { environments, activeEnvId } = useEnvStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("params");
  const [abortController, setAbortController] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const activeEnv = environments.find((e) => e.id === activeEnvId);

  // Connection Warm-up Optimization (Faster than Postman)
  useEffect(() => {
    if (!currentRequest.url) return;
    try {
      const url = new URL(
        currentRequest.url.startsWith("http")
          ? currentRequest.url
          : `https://${currentRequest.url}`
      );
      const origin = url.origin;

      let link = document.querySelector(`link[href="${origin}"]`);
      if (!link) {
        link = document.createElement("link");
        link.rel = "preconnect";
        link.href = origin;
        document.head.appendChild(link);
      }
    } catch {
      // Ignore invalid URLs while typing
    }
  }, [currentRequest.url]);

  const handleSend = async () => {
    if (!currentRequest.url) return;

    // Cancel existing request if any
    if (abortController) abortController.abort();

    const controller = new AbortController();
    setAbortController(controller);
    setLoading(true);

    const startTime = performance.now();
    const config = {
      ...prepareRequest(currentRequest, activeEnv),
      signal: controller.signal,
    };

    try {
      const response = await axios(config);
      const endTime = performance.now();
      const resData = {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        time: Math.round(endTime - startTime),
        size: JSON.stringify(response.data).length,
      };
      onResponse(resData);
      addToHistory(currentRequest, resData);
    } catch (error) {
      if (axios.isCancel(error)) return;

      const endTime = performance.now();
      const errorRes = {
        error: true,
        data: error.response?.data || error.message,
        status: error.response?.status || "Error",
        statusText:
          error.response?.statusText ||
          (error.code === "ERR_NETWORK" ? "Network Error / CORS" : "Error"),
        headers: error.response?.headers || {},
        time: Math.round(endTime - startTime),
        size: error.response?.data
          ? JSON.stringify(error.response.data).length
          : 0,
      };
      onResponse(errorRes);
    } finally {
      setLoading(false);
      setAbortController(null);
    }
  };

  const handleCancel = () => {
    if (abortController) {
      abortController.abort();
      setLoading(false);
      setAbortController(null);
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;

    // Detect if user pasted a curl command
    if (value.trim().startsWith("curl ")) {
      try {
        const parsed = parseCurl(value);
        updateCurrentRequest({
          method: parsed.method,
          url: parsed.url,
          headers:
            parsed.headers.length > 0
              ? parsed.headers
              : [{ key: "", value: "", enabled: true }],
          params:
            parsed.params.length > 0
              ? parsed.params
              : [{ key: "", value: "", enabled: true }],
          body: parsed.body,
        });
        // Clear the input since we parsed the curl
        e.target.value = parsed.url;
      } catch (error) {
        console.error("Failed to parse curl command:", error.message);
        // If parsing fails, just set the URL as normal
        updateCurrentRequest({ url: value });
      }
    } else {
      updateCurrentRequest({ url: value });
    }
  };

  const applyTemplate = (template) => {
    updateCurrentRequest({
      method: template.method,
      url: template.url,
      headers: template.headers,
      params: template.params,
      body: template.body,
    });
  };

  // Keyboard shortcuts (must be after all function definitions)
  useKeyboardShortcuts([
    { key: "Enter", ctrl: true, action: handleSend },
    { key: "s", ctrl: true, action: saveRequest },
    { key: "1", alt: true, action: () => setActiveTab("params") },
    { key: "2", alt: true, action: () => setActiveTab("headers") },
    { key: "3", alt: true, action: () => setActiveTab("body") },
  ]);

  const updateList = (type, index, key, value) => {
    const list = [...currentRequest[type]];
    list[index] = { ...list[index], [key]: value };
    updateCurrentRequest({ [type]: list });
  };

  const addListItem = (type) => {
    const list = [
      ...currentRequest[type],
      { key: "", value: "", enabled: true },
    ];
    updateCurrentRequest({ [type]: list });
  };

  const removeListItem = (type, index) => {
    const list = currentRequest[type].filter((_, i) => i !== index);
    updateCurrentRequest({ [type]: list });
  };

  return (
    <div className="flex flex-col h-full bg-card/20 animate-slide-in">
      {/* URL BAR */}
      <div className="p-6 border-b border-border/30 bg-card/40 backdrop-blur-sm flex gap-4 items-center sticky top-0 z-10 transition-all shadow-sm animate-fade-in-up">
        <div className="flex-none">
          <Select
            value={currentRequest.method}
            onChange={(e) => updateCurrentRequest({ method: e.target.value })}
            options={METHODS}
            className={`w-40 font-black text-sm ${
              currentRequest.method === "GET"
                ? "text-emerald-600"
                : currentRequest.method === "POST"
                ? "text-blue-600"
                : currentRequest.method === "PUT"
                ? "text-amber-600"
                : "text-rose-600"
            }`}
          />
        </div>
        <div className="flex-1 flex gap-3">
          <Input
            placeholder="https://api.example.com/v1/resource... or paste curl command"
            value={currentRequest.url}
            onChange={handleUrlChange}
            className="bg-card/60 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-mono text-sm shadow-lg hover:shadow-xl"
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === "Enter") handleSend();
            }}
          />
          {loading ? (
            <Button
              onClick={handleCancel}
              variant="destructive"
              className="min-w-[140px] gap-2 glow-secondary shadow-lg hover:shadow-xl"
            >
              <Loader2 className="animate-spin" size={18} />
              <span className="font-bold">CANCEL</span>
            </Button>
          ) : (
            <Button
              onClick={handleSend}
              disabled={!currentRequest.url}
              variant="brand"
              className={`min-w-[140px] gap-2 shadow-lg hover:shadow-xl transition-all duration-200 ${currentRequest.url ? 'animate-bounce-in' : ''}`}
            >
              <Send size={18} />
              <span className="font-bold">SEND</span>
            </Button>
          )}
          <Button
            variant="outline"
            onClick={saveRequest}
            className="gap-2 px-5 border-border/50 hover:border-primary/30 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Save size={18} />
            <span className="hidden lg:inline font-medium">Save</span>
          </Button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex px-6 border-b border-border/30 bg-card/20 text-xs font-bold tracking-widest uppercase font-sans shadow-inner">
        {["params", "headers", "body"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-4 transition-all duration-300 relative group hover:bg-accent/30 ${
              activeTab === tab
                ? "text-primary font-black"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 electric-gradient glow-primary rounded-t-sm" />
            )}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="flex-1 overflow-auto p-6 bg-card/10">
        {(activeTab === "params" || activeTab === "headers") && (
          <div className="space-y-4">
            {currentRequest[activeTab].map((item, index) => (
              <div key={index} className="flex gap-3 items-center p-3 bg-card/40 rounded-lg border border-border/30 hover:border-primary/20 transition-all duration-200 group">
                <Input
                  className="h-10 text-sm bg-background/60 border-border/50 focus:border-primary/40 transition-all duration-200"
                  placeholder="Key"
                  value={item.key}
                  onChange={(e) =>
                    updateList(activeTab, index, "key", e.target.value)
                  }
                />
                <Input
                  className="h-10 text-sm bg-background/60 border-border/50 focus:border-primary/40 transition-all duration-200"
                  placeholder="Value"
                  value={item.value}
                  onChange={(e) =>
                    updateList(activeTab, index, "value", e.target.value)
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all duration-200 rounded-lg"
                  onClick={() => removeListItem(activeTab, index)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addListItem(activeTab)}
              className="gap-3 text-sm px-4 py-3 border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 shadow-sm"
            >
              <Plus size={16} />
              Add {activeTab === "params" ? "Parameter" : "Header"}
            </Button>
          </div>
        )}

        {activeTab === "body" && (
          <div className="h-full min-h-[400px] border border-border/50 rounded-xl overflow-hidden shadow-lg bg-card/60">
            <Editor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={currentRequest.body}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                padding: { top: 16, bottom: 16, left: 16, right: 16 },
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
                wordWrap: "on",
              }}
              onChange={(value) => updateCurrentRequest({ body: value })}
            />
          </div>
        )}
      </div>

      {/* Request Templates Modal */}
      {showTemplates && (
        <RequestTemplates
          onClose={() => setShowTemplates(false)}
          onSelectTemplate={applyTemplate}
        />
      )}
    </div>
  );
};
