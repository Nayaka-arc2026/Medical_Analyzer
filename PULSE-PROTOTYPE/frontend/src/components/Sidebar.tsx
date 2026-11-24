
// import { NavLink } from "react-router-dom";
// import {
//   Activity,
//   LayoutDashboard,
//   Brain,
//   Bean,
//   Bone,
//   History,
//   FileText,
//   ScanLine,
// } from "lucide-react";

// const links = [
//   { name: "Dashboard", path: "/", icon: LayoutDashboard },
//   { name: "Brain Analysis", path: "/brain", icon: Brain },
//   { name: "Kidney Analysis", path: "/kidney", icon: Bean },
//   { name: "Fracture Analysis", path: "/fracture", icon: Bone },
//   { name: "Scan History", path: "/history", icon: History },
//   { name: "Reports", path: "/reports", icon: FileText },
// ];

// export default function Sidebar() {
//   return (
//     <aside className="w-64 min-h-screen bg-[#101827] text-white flex flex-col p-5">
//       <div className="flex items-center gap-3 mb-12">
//         <div className="bg-cyan-500 p-2 rounded-xl">
//           <Activity size={25} />
//         </div>
//         <div>
//           <h1 className="text-xl font-bold tracking-wide">PULSE</h1>
//           <p className="text-xs text-gray-400">MEDICAL AI</p>
//         </div>
//       </div>

//       <p className="text-xs text-gray-500 uppercase mb-4 tracking-widest">
//         Workspace
//       </p>

//       <nav className="space-y-2">
//         {links.map(({ name, path, icon: Icon }) => (
//           <NavLink
//             key={path}
//             to={path}
//             end={path === "/"}
//             className={({ isActive }) =>
//               `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
//                 isActive
//                   ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20"
//                   : "text-gray-400 hover:bg-slate-800 hover:text-white"
//               }`
//             }
//           >
//             <Icon size={19} />
//             <span className="text-sm font-medium">{name}</span>
//           </NavLink>
//         ))}
//       </nav>

//       <div className="mt-auto rounded-xl bg-slate-800 p-4">
//         <div className="flex items-center gap-2 text-cyan-400">
//           <ScanLine size={18} />
//           <span className="text-sm font-semibold">AI System</span>
//         </div>
//         <p className="text-xs text-gray-400 mt-2">
//           Model availability is shown in the analysis workspace.
//         </p>
//       </div>
//     </aside>
//   );
// }

import { NavLink } from "react-router-dom";
import {
  Activity,
  LayoutDashboard,
  Brain,
  Bean,
  Bone,
  History,
  FileText,
  ScanLine,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/", icon: LayoutDashboard },
  { name: "Brain Analysis", path: "/brain", icon: Brain },
  { name: "Kidney Analysis", path: "/kidney", icon: Bean },
  { name: "Fracture Analysis", path: "/fracture", icon: Bone },
  { name: "Scan History", path: "/history", icon: History },
  { name: "Reports", path: "/reports", icon: FileText },
];

export default function Sidebar() {
  return (
    <aside className="pulse-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <Activity size={25} />
          <span className="brand-pulse" />
        </div>

        <div>
          <h1>PULSE<span>AI</span></h1>
          <p>MEDICAL INTELLIGENCE</p>
        </div>
      </div>

      <div className="sidebar-section">
        <span className="sidebar-label">MAIN MENU</span>

        <nav className="sidebar-nav">
          {links.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              <span>{name}</span>
              <ChevronRight className="nav-arrow" size={15} />
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="sidebar-spacer" />

      <div className="ai-status-card">
        <div className="status-top">
          <div className="status-icon">
            <Sparkles size={19} />
          </div>
          <span className="status-live">SYSTEM ACTIVE</span>
        </div>

        <h3>AI Intelligence</h3>
        <p>Your medical analysis workspace is ready.</p>

        <div className="status-line">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="status-bottom">
          <ScanLine size={14} />
          <span>Neural systems online</span>
        </div>
      </div>

      <div className="sidebar-footer">
        <span className="footer-dot" />
        PULSE AI v1.0
        <span className="footer-right">SECURE</span>
      </div>
    </aside>
  );
}
