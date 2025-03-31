import { Routes, Route } from "react-router-dom"
import Dashboard from "./pages/Dashboard.jsx"
import Tenant from "./pages/Tenant.jsx"
import Security from "./pages/Security.jsx"
import Maintenance from "./pages/Maintenance.jsx"
import Events from "./pages/Events.jsx"
import Layout from "./components/Layout.jsx"
import "./App.css"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="tenants" element={<Tenant />} />
        <Route path="security" element={<Security />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="events" element={<Events />} />
      </Route>
    </Routes>
  )
}

export default App

