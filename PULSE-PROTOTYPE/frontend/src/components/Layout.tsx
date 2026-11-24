
// import { Outlet } from "react-router-dom";
// import Sidebar from "./Sidebar";
// import { Bell, Search } from "lucide-react";

// export default function Layout() {
//   return (
//     <div className="min-h-screen bg-[#f5f7fb] flex">
//       <Sidebar />

//       <main className="flex-1 min-w-0">
//         <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between">
//           <div className="relative w-80">
//             <Search className="absolute left-3 top-3 text-gray-400" size={18} />
//             <input
//               placeholder="Search scans..."
//               className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
//             />
//           </div>

//           <div className="flex items-center gap-5">
//             <button aria-label="Notifications" className="text-gray-500">
//               <Bell size={21} />
//             </button>
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
//                 PA
//               </div>
//               <div>
//                 <p className="text-sm font-semibold text-gray-800">
//                   Administrator
//                 </p>
//                 <p className="text-xs text-gray-400">Workspace</p>
//               </div>
//             </div>
//           </div>
//         </header>

//         <div className="p-8">
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import {
  Bell,
  Search,
  Command,
  X,
  LayoutDashboard,
  Brain,
  Bean,
  Bone,
  History,
  FileText,
  ArrowUpRight,
} from "lucide-react";

const commands = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Brain Analysis", path: "/brain", icon: Brain },
  { name: "Kidney Analysis", path: "/kidney", icon: Bean },
  { name: "Fracture Analysis", path: "/fracture", icon: Bone },
  { name: "Scan History", path: "/history", icon: History },
  { name: "Reports", path: "/reports", icon: FileText },
];

export default function Layout() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setPaletteOpen((open) => !open);
      }

      if (event.key === "Escape") {
        setPaletteOpen(false);
        setNotificationsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const filteredCommands = commands.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const goTo = (path: string) => {
    navigate(path);
    setPaletteOpen(false);
    setSearch("");
  };

  return (
    <div className="pulse-app">
      <Sidebar />

      <main className="pulse-main">
        <header className="pulse-header">
          <div className="header-breadcrumb">
            <span className="breadcrumb-muted">WORKSPACE</span>
            <span className="breadcrumb-divider">/</span>
            <span className="breadcrumb-current">Medical Intelligence</span>
          </div>

          <div className="header-actions">
            <button
              className="command-trigger"
              onClick={() => setPaletteOpen(true)}
            >
              <Search size={16} />
              <span>Quick search</span>
              <kbd>Ctrl K</kbd>
            </button>

            <div className="notification-wrapper">
              <button
                className="icon-button notification-button"
                aria-label="Notifications"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell size={19} />
                <span className="notification-dot" />
              </button>

              {notificationsOpen && (
                <div className="notification-popover">
                  <div className="popover-heading">
                    <strong>Notifications</strong>
                    <button onClick={() => setNotificationsOpen(false)}>
                      <X size={16} />
                    </button>
                  </div>
                  <div className="notification-item">
                    <span className="notification-indicator" />
                    <div>
                      <strong>Welcome to PULSE AI</strong>
                      <p>Your medical workspace is ready.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="header-divider" />

            <div className="user-profile">
              <div className="user-avatar">PA</div>
              <div className="user-details">
                <strong>Administrator</strong>
                <span>Workspace Owner</span>
              </div>
            </div>
          </div>
        </header>

        <div className="pulse-content">
          <Outlet />
        </div>
      </main>

      {paletteOpen && (
        <div
          className="command-overlay"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="command-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="command-input-wrap">
              <Search size={20} />
              <input
                autoFocus
                placeholder="Search workspace..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button onClick={() => setPaletteOpen(false)}>
                <X size={19} />
              </button>
            </div>

            <div className="command-label">QUICK NAVIGATION</div>

            <div className="command-list">
              {filteredCommands.map(({ name, path, icon: Icon }) => (
                <button
                  key={path}
                  className="command-item"
                  onClick={() => goTo(path)}
                >
                  <Icon size={18} />
                  <span>{name}</span>
                  <ArrowUpRight size={15} />
                </button>
              ))}

              {filteredCommands.length === 0 && (
                <p className="command-empty">No matching workspace found.</p>
              )}
            </div>

            <div className="command-footer">
              <span><kbd>ESC</kbd> Close</span>
              <span><Command size={13} /> PULSE COMMAND CENTER</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
