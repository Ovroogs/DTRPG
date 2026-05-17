import "@xyflow/react/dist/style.css";
import "@/styles/globals.css";

import { HashRouter, Routes, Route } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { SkillTreePage } from "@/components/SkillTreePage";
import { SkillPage } from "@/components/SkillPage";

const Placeholder = ({ title }: { title: string }) => (
  <div className="flex-1 h-screen flex items-center justify-center bg-slate-950 text-slate-500">
    <p className="text-xl font-bold uppercase tracking-wider">{title}</p>
  </div>
);

function App() {
  return (
    <HashRouter>
      <div className="flex w-screen h-screen bg-slate-950 overflow-hidden text-slate-200">
        <Sidebar />

        <main className="flex-1 h-screen relative overflow-hidden">
          <Routes>
            <Route path="/" element={<SkillTreePage />} />
            <Route path="/skills" element={<SkillPage />} />
            <Route
              path="/races"
              element={<Placeholder title="Редактор рас" />}
            />
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
