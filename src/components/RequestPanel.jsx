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
    <div className="flex flex-col h-full bg-background">
      {/* URL BAR */}
      <div className="p-4 border-b flex gap-2">
        <Select
          value={currentRequest.method}
          onChange={(e) => updateCurrentRequest({ method: e.target.value })}
          options={METHODS}
          className="w-32 font-bold"
        />
        <Input
          placeholder="Enter request URL"
          value={currentRequest.url}
          onChange={(e) => updateCurrentRequest({ url: e.target.value })}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "Enter") handleSend();
          }}
        />
        <Button
          onClick={handleSend}
          disabled={loading || !currentRequest.url}
          className="min-w-[100px] gap-2"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Send size={18} />
          )}
          Send
        </Button>
        <Button variant="outline" onClick={saveRequest} className="gap-2">
          <Save size={18} />
          Save
        </Button>
      </div>

      {/* TABS */}
      <div className="flex border-b text-sm">
        {["params", "headers", "body"].map((tab) => (
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
