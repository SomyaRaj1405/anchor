import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowLeftRight,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  Grid2x2,
  Info,
  Menu,
  UserRound,
} from "lucide-react";
import AnchorBrand, { AnchorLogo } from "./ui/AnchorBrand";
import { useAuth } from "../auth/AuthContext";

const ROLE_NAV_ITEMS = {
  candidate: [
    { to: "/", label: "Overview", icon: Grid2x2 },
    { to: "/diagnose", label: "Check a profile", icon: UserRound },
    { to: "/transition", label: "Transition paths", icon: ArrowLeftRight },
    { to: "/evidence", label: "Evidence", icon: FileText },
  ],
  employer: [
    { to: "/", label: "Overview", icon: Grid2x2 },
    { to: "/simulate", label: "Explore scenarios", icon: Compass },
    { to: "/audit", label: "Screening rules", icon: BriefcaseBusiness },
    { to: "/evidence", label: "Evidence", icon: FileText },
  ],
  reviewer: [
    { to: "/", label: "Overview", icon: Grid2x2 },
    { to: "/diagnose", label: "Check a profile", icon: UserRound },
    { to: "/transition", label: "Transition paths", icon: ArrowLeftRight },
    { to: "/simulate", label: "Explore scenarios", icon: Compass },
    { to: "/evidence", label: "Evidence", icon: FileText },
  ],
};

const PAGE_TITLES = {
  "/": "Overview",
  "/evidence": "Evidence registry",
  "/transition": "Transition paths",
  "/diagnose": "Check a profile",
  "/diagnostic": "Check a profile",
  "/simulate": "Explore scenarios",
  "/lab": "Explore scenarios",
  "/audit": "Screening rules",
  "/ontology": "Competency ontology",
  "/about": "Methodology",
  "/methodology": "Methodology",
  "/terms": "Terms",
  "/privacy": "Privacy",
};

const isEvidenceRoute = (pathname) =>
  ["/evidence", "/about", "/methodology", "/audit", "/ontology"].includes(pathname);

export default function AppShell({ children }) {
  const location = useLocation();
  const { user, signOut, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = window.localStorage.getItem("anchor-sidebar-collapsed");
    return stored ? JSON.parse(stored) : false;
  });

  useEffect(() => {
    document.title = `${PAGE_TITLES[location.pathname] || "Anchor"} | Anchor`;
  }, [location.pathname]);

  useEffect(() => {
    window.localStorage.setItem("anchor-sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const handleShortcut = (event) => {
      const target = event.target;
      const isTextField =
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT");

      if (!isTextField && event.key === "[") {
        setCollapsed((current) => !current);
      }
    };

    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  }, []);

  const currentPageName = PAGE_TITLES[location.pathname] || "Workspace";
  const navItems = user ? ROLE_NAV_ITEMS[user.role] || ROLE_NAV_ITEMS.candidate : [
    { to: "/", label: "Overview", icon: Grid2x2 },
  ];

  const evidenceTabActive = useMemo(
    () => (isEvidenceRoute(location.pathname) ? location.pathname : "/evidence"),
    [location.pathname]
  );

  const handleSignOut = () => {
    signOut();
    window.location.href = "/sign-in";
  };

  if (location.pathname === "/sign-in") {
    return <>{children}</>;
  }

  return (
    <div className="app-shell">
      {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />}

      <aside className={`sidebar ${collapsed ? "collapsed" : ""} ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={() => setCollapsed((current) => !current)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            {!collapsed && <span className="sidebar-shortcut">[</span>}
          </button>

          {!collapsed && (
            <Link to="/" className="sidebar-brand-link" onClick={() => setSidebarOpen(false)}>
              <AnchorBrand size={18} />
            </Link>
          )}
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to || (item.to === "/evidence" && isEvidenceRoute(location.pathname));

            return (
              <div key={item.to} className="nav-group">
                <NavLink
                  to={item.to}
                  end={item.to === "/"}
                  className={`nav-item ${isActive ? "active" : ""}`}
                  onClick={() => setSidebarOpen(false)}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={16} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          {isAuthenticated && user ? (
            <button type="button" className="user-chip user-chip-button" onClick={handleSignOut} title={collapsed ? "Sign out" : undefined}>
              <span className="user-avatar">{user.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>
              {!collapsed && (
                <div className="user-text">
                  <strong>{user.name}</strong>
                  <span>{user.role}</span>
                </div>
              )}
            </button>
          ) : (
            <Link to="/sign-in" className="user-chip" title={collapsed ? "Sign in" : undefined}>
              <span className="user-avatar">A</span>
              {!collapsed && (
                <div className="user-text">
                  <strong>Sign in</strong>
                  <span>Member</span>
                </div>
              )}
            </Link>
          )}
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen((current) => !current)}
              aria-label="Open navigation"
            >
              <Menu size={18} />
            </button>

            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Anchor</Link>
              <span>/</span>
              <span>{currentPageName}</span>
            </nav>
          </div>

          <div className="topbar-right">
            <div className="page-title-wrap">
              <span className="eyebrow">Anchor</span>
              <h1>{currentPageName}</h1>
            </div>

            {isAuthenticated && user ? (
              <button type="button" className="user-menu" aria-label="User menu" onClick={handleSignOut}>
                <span className="user-badge">{user.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span>
                {!collapsed && <span>{user.name}</span>}
              </button>
            ) : (
              <Link to="/sign-in" className="user-menu" aria-label="Sign in">
                <span className="user-badge">A</span>
                {!collapsed && <span>Sign in</span>}
              </Link>
            )}
          </div>
        </header>

        <main>
          <div className="page-container">{children}</div>
        </main>

        <footer className="app-footer">
          <div className="footer-brand">
            <AnchorLogo size={16} />
            <span>Anchor</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
