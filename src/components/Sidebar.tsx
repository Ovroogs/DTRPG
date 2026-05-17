import { NavLink } from "react-router-dom";
import {
  Network,
  BookOpen,
  Sparkles,
  User,
  Scroll,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigationStore } from "@/stores/useNavigationStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const menuItems = [
  { path: "/", label: "Древо навыков", icon: Network },
  { path: "/skills", label: "Навыки", icon: Scroll },
  { path: "/races", label: "Расы", icon: User },
  { path: "/spells", label: "Заклинания и Книги", icon: Sparkles },
  { path: "/rules", label: "Правила", icon: ShieldAlert },
  { path: "/character", label: "Лист персонажа", icon: BookOpen },
];

export function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useNavigationStore();

  return (
    <TooltipProvider delayDuration={200}>
      <aside
        className={`h-screen flex flex-col border-r border-slate-900 bg-slate-950 text-slate-200 select-none shrink-0 transition-all duration-300 relative ${
          isSidebarOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Шапка */}
        <div
          className={`p-4 flex items-center h-16 ${isSidebarOpen ? "justify-between" : "justify-center"}`}
        >
          {isSidebarOpen && (
            <div className="flex flex-col gap-1 animate-in fade-in duration-200">
              <h1 className="text-sm font-black text-amber-500 uppercase tracking-widest">
                Панель навигации
              </h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-500 hover:text-slate-200 shrink-0"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>

        <Separator className="bg-slate-900 mb-2" />

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Tooltip key={item.path} disableHoverableContent={isSidebarOpen}>
                <TooltipTrigger asChild>
                  <div>
                    {" "}
                    <NavLink to={item.path}>
                      {({ isActive }) => (
                        <Button
                          variant={isActive ? "secondary" : "ghost"}
                          className={`w-full font-medium transition-all ${
                            isSidebarOpen
                              ? "justify-start gap-3 px-3"
                              : "justify-center px-0 h-10 w-12 mx-auto"
                          } ${
                            isActive
                              ? "bg-slate-900 text-amber-500 border border-slate-800/50"
                              : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-500" : "text-slate-500"}`}
                          />

                          <span
                            className={`transition-all duration-200 overflow-hidden whitespace-nowrap text-sm ${
                              isSidebarOpen
                                ? "w-auto opacity-100 block"
                                : "w-0 opacity-0 hidden"
                            }`}
                          >
                            {item.label}
                          </span>
                        </Button>
                      )}
                    </NavLink>
                  </div>
                </TooltipTrigger>

                {!isSidebarOpen && (
                  <TooltipContent
                    side="right"
                    sideOffset={12}
                    className="bg-slate-900 border-slate-800 text-slate-200 font-medium px-3 py-1.5 shadow-xl"
                  >
                    {item.label}
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </nav>
      </aside>
    </TooltipProvider>
  );
}
