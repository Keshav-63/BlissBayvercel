"use client"

import { useState } from "react"
import { Outlet, NavLink, useLocation } from "react-router-dom"
import { Home, ShoppingBag, Shield, Tool, Calendar, Menu, X, User, Bell } from "react-feather"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const closeSidebar = () => {
    if (window.innerWidth < 992) {
      setSidebarOpen(false)
    }
  }

  return (
    <div className="layout">
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">BlissBay Mall</div>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            <X size={20} />
          </button>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`} onClick={closeSidebar}>
            <Home size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink
            to="/tenants"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <ShoppingBag size={18} />
            <span>Tenants</span>
          </NavLink>
          <NavLink
            to="/security"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Shield size={18} />
            <span>Security</span>
          </NavLink>
          <NavLink
            to="/maintenance"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Tool size={18} />
            <span>Maintenance</span>
          </NavLink>
          <NavLink
            to="/events"
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            onClick={closeSidebar}
          >
            <Calendar size={18} />
            <span>Events</span>
          </NavLink>
        </nav>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="flex items-center gap-4">
            <button className="header-toggle btn btn-outline" onClick={toggleSidebar}>
              <Menu size={18} />
            </button>
            <h1>
              {location.pathname === "/" && "Dashboard"}
              {location.pathname === "/tenants" && "Tenant Management"}
              {location.pathname === "/security" && "Security Management"}
              {location.pathname === "/maintenance" && "Maintenance Requests"}
              {location.pathname === "/events" && "Event Management"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="user-profile">
              <div className="user-avatar">
                <User size={18} />
              </div>
              <div>
                <div className="font-bold">Admin User</div>
                <div className="text-sm text-secondary">Mall Manager</div>
              </div>
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  )
}

export default Layout

