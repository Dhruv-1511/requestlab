import React from "react";
import { Plus, History, Folder, Trash2, Settings, Server } from "lucide-react";
import { useRequestStore } from "../store/useRequestStore";
import { useEnvStore } from "../store/useEnvStore";
import { Button } from "./ui/Button";

export const Sidebar = () => {
  const { collections, currentRequest, setCurrentRequest, deleteRequest } =
    useRequestStore();
  const { environments, activeEnvId, setActiveEnv } = useEnvStore();

  const createNewRequest = () => {
    setCurrentRequest({
      id: "new",
      name: "Untitled Request",
      method: "GET",
      url: "",
      params: [{ key: "", value: "", enabled: true }],
      headers: [{ key: "", value: "", enabled: true }],
      body: "",
      bodyType: "json",
    });
  };

  return (
    <div className="w-64 border-r bg-card flex flex-col h-screen overflow-hidden">
      <div className="p-4 border-b space-y-4">
        <Button
          onClick={createNewRequest}
          className="w-full justify-start gap-2"
          variant="primary"
        >
          <Plus size={18} />
          New Request
        </Button>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
            <Server size={14} />
            Environment
          </label>
          <select
            value={activeEnvId || ""}
            onChange={(e) => setActiveEnv(e.target.value)}
            className="w-full bg-background border rounded p-1 text-sm outline-none"
          >
            <option value="">No Environment</option>
            {environments.map((env) => (
              <option key={env.id} value={env.id}>
                {env.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <div className="mb-4">
          <h3 className="px-2 mb-2 text-xs font-semibold uppercase text-muted-foreground flex items-center gap-2">
            <Folder size={14} />
            Collections
          </h3>
          <div className="space-y-1">
            {collections.map((req) => (
              <div
                key={req.id}
                onClick={() => setCurrentRequest(req)}
                className={`group flex items-center justify-between p-2 rounded cursor-pointer text-sm transition-colors ${
                  currentRequest.id === req.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-accent"
                }`}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <span
                    className={`text-[10px] font-bold w-12 text-center uppercase ${
                      req.method === "GET"
                        ? "text-green-500"
                        : req.method === "POST"
                        ? "text-blue-500"
                        : req.method === "PUT"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {req.method}
                  </span>
                  <span className="truncate">{req.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRequest(req.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-destructive"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {collections.length === 0 && (
              <p className="px-2 text-xs text-muted-foreground italic">
                No saved requests
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t flex items-center justify-between">
        <Button variant="ghost" size="sm" className="p-1">
          <Settings size={18} />
        </Button>
        <span className="text-[10px] font-mono text-muted-foreground">
          AG API v1.0
        </span>
      </div>
    </div>
  );
};
