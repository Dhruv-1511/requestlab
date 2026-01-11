import { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { RequestPanel } from "./components/RequestPanel";
import { ResponsePanel } from "./components/ResponsePanel";
import { Github, Sun, Moon } from "lucide-react";
import { Button } from "./components/ui/Button";

function App() {
  const [response, setResponse] = useState(null);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans selection:bg-primary/30">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b flex items-center justify-between px-4 bg-background/80 backdrop-blur-xl z-20 sticky top-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-9 h-9 p-0"
              onClick={() => setIsDark(!isDark)}
            >
              {isDark ? (
                <Sun size={18} className="text-yellow-400" />
              ) : (
                <Moon size={18} className="text-primary" />
              )}
            </Button>
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <Github size={18} />
                <span className="text-xs font-medium">GitHub</span>
              </a>
            </Button>
          </div>
        </header>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-background/50">
          <div className="flex-1 min-h-[40%] transition-all duration-300 ease-in-out">
            <RequestPanel onResponse={setResponse} />
          </div>
          <div className="h-px bg-border hover:bg-primary/50 transition-colors cursor-row-resize relative group">
            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex-1 min-h-[30%] transition-all duration-300 ease-in-out">
            <ResponsePanel response={response} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
