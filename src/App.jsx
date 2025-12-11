// src/App.jsx
import { Routes, Route, Outlet, Navigate } from "react-router-dom";


import AdminCentralLogin from "./pages/admin/AdminCentralLogin";
import AdminCentralLayout from "./components/admin/AdminCentralLayout";
import CentralDashboard from "./pages/admin/CentralDashboard";
import CentralSyncMonitoring from "./pages/admin/CentralSyncMonitoring";
import CentralRegionManagement from "./pages/admin/CentralRegionManagement";
import CentralDataIntegrity from "./pages/admin/CentralDataIntegrity";
import CentralProfile from "./pages/admin/CentralProfile";


// Wrapper untuk route public (pakai MainLayout)
function PublicLayoutWrapper() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

function App() {
  return (
    <Routes>
      {/* ketika user buka "/" langsung diarahkan ke /admin/daerah */}
      <Route path="/" element={<Navigate to="/admin/pusat" replace />} />

      <Route path="/admin/pusat" element={<AdminCentralLogin />} />
      <Route path="/admin/pusat/panel" element={<AdminCentralLayout />}>
        <Route index element={<CentralDashboard />} />
        <Route path="dashboard" element={<CentralDashboard />} />
        <Route
          path="monitoring-sinkron"
          element={<CentralSyncMonitoring />}
        />

        {/* menambahkan & mengkonfigurasi server daerah */}
        <Route
          path="server-daerah"
          element={<CentralRegionManagement />}
        />

        {/* validasi status data & integritas metadata */}
        <Route
          path="integritas-data"
          element={<CentralDataIntegrity />}
        />

        <Route
          path="profile"
          element={<CentralProfile />}
        />
      </Route>
    </Routes>
  );
}

export default App;
