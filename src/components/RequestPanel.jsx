import React, { useState } from "react";
import axios from "axios";
import { Send, Loader2, Save, Trash2, Plus } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useRequestStore } from "../store/useRequestStore";
import { useEnvStore } from "../store/useEnvStore";
import { prepareRequest } from "../utils/resolver";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";

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

  const activeEnv = environments.find((e) => e.id === activeEnvId);

  const handleSend = async () => {
    if (!currentRequest.url) return;
    setLoading(true);
    const startTime = Date.now();

    const config = prepareRequest(currentRequest, activeEnv);

    try {
      const response = await axios(config);
      const endTime = Date.now();
      const resData = {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        time: endTime - startTime,
        size: JSON.stringify(response.data).length,
      };
      onResponse(resData);
      addToHistory(currentRequest, resData);
    } catch (error) {
      const endTime = Date.now();
      const errorRes = {
        error: true,
        data: error.response?.data || error.message,
        status: error.response?.status || "Error",
        statusText:
          error.response?.statusText ||
          (error.code === "ERR_NETWORK" ? "Network Error / CORS" : "Error"),
        headers: error.response?.headers || {},
        time: endTime - startTime,
        size: error.response?.data
          ? JSON.stringify(error.response.data).length
          : 0,
      };
      onResponse(errorRes);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="flex flex-col h-full bg-background/30">
      {/* URL BAR */}
      <div className="p-4 border-b bg-card/30 backdrop-blur-sm flex gap-3 items-center sticky top-0 z-10">
        <div className="flex-none">
          <Select
            value={currentRequest.method}
            onChange={(e) => updateCurrentRequest({ method: e.target.value })}
            options={METHODS}
            className="w-32 font-bold bg-background/50 border-primary/20 text-primary"
          />
        </div>
        <div className="flex-1 flex gap-2">
          <Input
            placeholder="https://api.example.com/v1/..."
            value={currentRequest.url}
            onChange={(e) => updateCurrentRequest({ url: e.target.value })}
            className="bg-background/50 border-primary/10 focus:border-primary/50 transition-all font-mono text-sm"
            onKeyDown={(e) => {
              if (e.ctrlKey && e.key === "Enter") handleSend();
            }}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !currentRequest.url}
            variant="brand"
            className="min-w-[120px] gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Send size={18} />
            )}
            <span className="font-bold">SEND</span>
          </Button>
          <Button
            variant="outline"
            onClick={saveRequest}
            className="gap-2 px-4"
          >
            <Save size={18} />
            <span className="hidden md:inline">Save</span>
          </Button>
        </div>
      </div>

      {/* TABS */}
      <div className="flex px-4 border-b bg-background/20 text-[11px] font-extrabold tracking-widest uppercase font-sans">
        {["params", "headers", "body"].map((tab) => (
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

      {/* TAB CONTENT */}
      <div className="flex-1 overflow-auto p-4">
        {(activeTab === "params" || activeTab === "headers") && (
          <div className="space-y-2">
            {currentRequest[activeTab].map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  className="h-8 text-xs"
                  placeholder="Key"
                  value={item.key}
                  onChange={(e) =>
                    updateList(activeTab, index, "key", e.target.value)
                  }
                />
                <Input
                  className="h-8 text-xs"
                  placeholder="Value"
                  value={item.value}
                  onChange={(e) =>
                    updateList(activeTab, index, "value", e.target.value)
                  }
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => removeListItem(activeTab, index)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => addListItem(activeTab)}
              className="gap-2 text-xs"
            >
              <Plus size={14} /> Add{" "}
              {activeTab === "params" ? "Parameter" : "Header"}
            </Button>
          </div>
        )}

        {activeTab === "body" && (
          <div className="h-full min-h-[300px] border rounded-md overflow-hidden">
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
                scrollbar: {
                  vertical: "hidden",
                  horizontal: "hidden",
                },
              }}
              onChange={(value) => updateCurrentRequest({ body: value })}
            />
          </div>
        )}
      </div>
    </div>
  );
};
