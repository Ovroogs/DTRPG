import { HashRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { SkillTreePage } from "@/components/tree/SkillTreePage";
import { SkillPage } from "@/components/skills/SkillPage";
import { RacePage } from "./components/races/RacePage";
import { useNavigationStore } from "./stores/useNavigationStore";
import { useEffect } from "react";

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex-1 h-screen flex items-center justify-center bg-slate-950 text-slate-500">
    <p className="text-xl font-bold uppercase tracking-wider">{title}</p>
  </div>
);

function App() {
  const initPlatform = useNavigationStore((state) => state.initPlatform);
  const platform = useNavigationStore((state) => state.platform);
  const isAndroid = platform === "android";

  useEffect(() => {
    initPlatform();
  }, [initPlatform]);

  return (
    <HashRouter>
      <div
        className={`flex ${isAndroid ? "flex-col-reverse" : "flex-row"} w-screen h-screen bg-slate-950 text-slate-200`}
      >
        <Sidebar />

        <main className="flex-1 overflow-hidden h-full pb-0">
          <Routes>
            <Route path="/" element={<SkillTreePage />} />
            <Route path="/skills" element={<SkillPage />} />
            <Route path="/races" element={<RacePage />} />
            <Route
              path="/spells"
              element={<Placeholder title="Редактор заклинаний и книг" />}
            />
            <Route
              path="/rules"
              element={<Placeholder title="Редактор правил" />}
            />
            <Route
              path="/character"
              element={<Placeholder title="Лист персонажа" />}
            />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
}

export default App;
