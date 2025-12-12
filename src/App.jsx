// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/common/ProtectedRoute";
import AdminCentralLogin from "./pages/admin/AdminCentralLogin";
import AdminCentralLayout from "./components/admin/AdminCentralLayout";
import CentralDashboard from "./pages/admin/CentralDashboard";
import CentralSyncMonitoring from "./pages/admin/CentralSyncMonitoring";
import CentralRegionManagement from "./pages/admin/CentralRegionManagement";
import CentralLembagaManagement from "./pages/admin/CentralLembagaManagement";
import CentralPutusanManagement from "./pages/admin/CentralPutusanManagement";
import CentralDataIntegrity from "./pages/admin/CentralDataIntegrity";
import CentralProfile from "./pages/admin/CentralProfile";

function App() {
  return (
    <Routes>
      {/* Redirect root ke admin pusat */}
      <Route path="/" element={<Navigate to="/admin/pusat" replace />} />

      {/* Login page (public) */}
      <Route path="/admin/pusat" element={<AdminCentralLogin />} />
      
      {/* Protected admin routes */}
      <Route 
        path="/admin/pusat/panel" 
        element={
          <ProtectedRoute>
            <AdminCentralLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<CentralDashboard />} />
        <Route path="dashboard" element={<CentralDashboard />} />
        <Route path="monitoring-sinkron" element={<CentralSyncMonitoring />} />
        <Route path="server-daerah" element={<CentralRegionManagement />} />
        <Route path="lembaga" element={<CentralLembagaManagement />} />
        <Route path="putusan" element={<CentralPutusanManagement />} />
        <Route path="integritas-data" element={<CentralDataIntegrity />} />
        <Route path="profile" element={<CentralProfile />} />
      </Route>
    </Routes>
  );
}

export default App;
