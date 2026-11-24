
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import BrainAnalysis from "./pages/BrainAnalysis";
import KidneyAnalysis from "./pages/KidneyAnalysis";
import FractureAnalysis from "./pages/FractureAnalysis";
import ScanHistory from "./pages/ScanHistory";
import Reports from "./pages/Reports";
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/brain" element={<BrainAnalysis />} />
          <Route path="/kidney" element={<KidneyAnalysis />} />
          <Route path="/fracture" element={<FractureAnalysis />} />
          <Route path="/history" element={<ScanHistory />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
