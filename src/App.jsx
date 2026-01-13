import { useState, useEffect, useRef } from "react";
import { Sidebar } from "./components/Sidebar";
import { RequestPanel } from "./components/RequestPanel";
import { ResponsePanel } from "./components/ResponsePanel";
import { Github, Sun, Moon, ChevronDown, Search, Server } from "lucide-react";
import { Button } from "./components/ui/Button";
import { useThemeStore } from "./store/useThemeStore";
import { useRequestStore } from "./store/useRequestStore";
import logo from './assets/logo.png';

function App() {
  const { isDark, toggleTheme } = useThemeStore();
  const { currentResponse, setCurrentResponse } = useRequestStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [requestPanelHeight, setRequestPanelHeight] = useState(50); // percentage
  const containerRef = useRef(null);
  const isResizingRef = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.key === "/" &&
        e.target.tagName !== "INPUT" &&
        e.target.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newHeight = ((e.clientY - rect.top) / rect.height) * 100;
      setRequestPanelHeight(Math.max(20, Math.min(80, newHeight)));
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.body.style.cursor = "";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">
      <Sidebar searchTerm={searchTerm} />

      <main className="flex-1 flex flex-col min-w-0 bg-background/50">
        <header className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card/80 backdrop-blur-xl z-20 sticky top-0 shadow-sm">
          <div className="flex items-center gap-8 overflow-hidden">
            <div className="flex items-center gap-3 border-r pr-8 border-border/30">
              <div className="w-10 h-10 rounded-xl electric-gradient flex items-center justify-center text-white font-black text-sm shadow-lg animate-pulse-glow">
                RL
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                  Workspace
                </span>
                <span className="text-base font-bold truncate max-w-[180px] text-foreground">
                  My RequestLab
                </span>
              </div>
              <ChevronDown size={16} className="text-muted-foreground ml-2 hover:text-primary transition-colors" />
            </div>

            <div className="hidden lg:flex items-center gap-3 bg-muted/40 px-4 py-2.5 rounded-xl border border-border/50 w-72 group focus-within:ring-2 ring-primary/20 focus-within:border-primary/30 transition-all duration-300">
              <Search
                size={16}
                className="text-muted-foreground group-focus-within:text-primary transition-colors"
              />
              <input
                id="global-search"
                type="text"
                placeholder="Search collections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/60 font-medium"
              />
              <span className="text-[10px] font-bold text-muted-foreground/50 bg-background px-2 py-1 rounded border border-border/50">
                ⌘K
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-3 px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 rounded-full shadow-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-emerald-500/50" />
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                Cloud Synced
              </span>
            </div>

            <div className="hidden md:flex items-center gap-3 bg-card/60 border border-border/50 rounded-xl px-3 py-2 shadow-sm backdrop-blur-sm">
              <Server size={16} className="text-primary/70" />
              <select className="bg-transparent border-none outline-none text-xs font-bold tracking-wide uppercase cursor-pointer pr-6 text-foreground">
                <option>No Environment</option>
                <option>Production API</option>
                <option>Staging</option>
                <option>Localhost</option>
              </select>
            </div>

            <div className="flex items-center gap-3 border-l pl-6 border-border/30">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 p-0 rounded-xl hover:bg-accent transition-all duration-200 hover:scale-105"
                  onClick={toggleTheme}
                >
                 {isDark ? (
                   <Sun size={20} className="text-yellow-400" />
                 ) : (
                   <Moon size={20} className="text-slate-600" />
                 )}
               </Button>
               <Button
                 variant="ghost"
                 size="sm"
                 className="hidden sm:flex w-10 h-10 p-0 rounded-xl hover:bg-accent transition-all duration-200 hover:scale-105"
               >
                 <a
                   href="https://github.com"
                   target="_blank"
                   rel="noreferrer"
                   className="flex items-center"
                 >
                   <Github size={20} />
                 </a>
               </Button>
               <div className="w-10 h-10 rounded-full border-2 border-primary/30 p-0.5 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 cursor-pointer bg-card/50">
                 <div className="w-full h-full rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                   <img
                     src={logo}
                     className="w-full h-full object-cover scale-125 grayscale opacity-90"
                     alt="Profile"
                   />
                 </div>
               </div>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-gradient-to-b from-background/80 to-background/40">
           <div style={{ height: `${requestPanelHeight}%` }} className="transition-all duration-300 ease-in-out">
             <RequestPanel onResponse={setCurrentResponse} />
           </div>
           <div
             className="h-1 bg-border/50 hover:bg-primary/60 transition-all duration-200 cursor-row-resize relative group shadow-inner"
             onMouseDown={() => {
               isResizingRef.current = true;
               document.body.style.cursor = "row-resize";
             }}
           >
             <div className="absolute inset-0 bg-primary/30 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-sm" />
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-0.5 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200" />
           </div>
            <div style={{ height: `${100 - requestPanelHeight}%`, minHeight: '240px' }} className="transition-all duration-300 ease-in-out">
              <ResponsePanel response={currentResponse} />
            </div>
         </div>
      </main>
    </div>
  );
}

export default App;
