import React from "react";
import { Plus, History, Folder, Trash2, Settings, Server } from "lucide-react";
import { useRequestStore } from "../store/useRequestStore";
import { useEnvStore } from "../store/useEnvStore";
import { Button } from "./ui/Button";
import logo from '../assets/logo.png';

export const Sidebar = ({ searchTerm = "" }) => {
  const { collections, currentRequest, setCurrentRequest, deleteRequest } =
    useRequestStore();
  // eslint-disable-next-line no-unused-vars
  const { environments, activeEnvId, setActiveEnv } = useEnvStore();

  const filteredCollections = collections.filter(
    (req) =>
      req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.method.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="w-72 border-r border-border/50 bg-card/90 flex flex-col h-screen overflow-hidden shadow-2xl z-20 backdrop-blur-xl">
      <div className="p-8 border-b border-border/30 space-y-8">
        <div className="flex items-center gap-3 py-2">
          <img
            src={logo}
            alt="RequestLab"
            className="size-14 object-contain"
          />
          <h2 className="text-2xl font-black tracking-tighter bg-gradient-to-r from-primary via-secondary to-purple-500 bg-clip-text text-transparent">
            RequestLab
          </h2>
        </div>

        <Button
          onClick={createNewRequest}
          variant="brand"
          className="w-full justify-start gap-4 py-8 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        >
          <Plus size={24} />
          <span className="tracking-tight">
            New Request
          </span>
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
        <div>
          <h3 className="px-4 mb-4 text-xs font-bold tracking-widest uppercase text-muted-foreground/70 flex items-center gap-3">
            <Folder size={16} />
            Collections
          </h3>
          <div className="space-y-2">
            {filteredCollections.map((req) => (
              <div
                key={req.id}
                onClick={() => setCurrentRequest(req)}
                className={`group flex items-center justify-between p-4 rounded-xl cursor-pointer text-sm transition-all duration-300 hover:shadow-md ${
                  currentRequest.id === req.id
                    ? "bg-primary/15 text-primary border border-primary/30 shadow-lg"
                    : "hover:bg-accent/40 hover:translate-x-2 hover:scale-[1.02]"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <span
                    className={`text-xs font-black w-12 text-center uppercase py-1 rounded-lg border shadow-sm ${
                      req.method === "GET"
                        ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30"
                        : req.method === "POST"
                        ? "bg-blue-500/20 text-blue-600 border-blue-500/30"
                        : req.method === "PUT"
                        ? "bg-amber-500/20 text-amber-600 border-amber-500/30"
                        : "bg-rose-500/20 text-rose-600 border-rose-500/30"
                    }`}
                  >
                    {req.method}
                  </span>
                  <span className="truncate font-semibold text-foreground">{req.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteRequest(req.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-destructive/15 hover:text-destructive rounded-lg transition-all duration-200 hover:scale-110"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {collections.length === 0 && (
              <div className="px-6 py-12 text-center border-2 border-dashed border-muted/50 rounded-2xl bg-muted/5">
                <div className="w-12 h-12 mx-auto mb-4 opacity-30">
                  <Folder size={48} className="text-muted-foreground/30" />
                </div>
                <p className="text-sm text-muted-foreground font-semibold">
                  No saved requests yet
                </p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  Create your first request above
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 border-t border-border/30 bg-card/50 backdrop-blur-sm flex items-center justify-between shadow-inner">
        <Button
          variant="ghost"
          size="sm"
          className="w-10 h-10 p-0 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-110"
        >
          <Settings size={20} />
        </Button>
        <div className="flex flex-col items-end">
          <span className="text-xs font-black tracking-tighter text-primary/90">
            REQUESTLAB v2.0
          </span>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Pro Edition
          </span>
        </div>
      </div>
    </div>
  );
};
