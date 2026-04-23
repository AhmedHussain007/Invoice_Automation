import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

/**
 * DashboardLayout
 * - Guards all /dashboard/* routes (redirects to /login if not authenticated)
 * - Renders the top navigation bar with 3 main sections
 * - Renders child routes via <Outlet />
 */
export default function DashboardLayout() {
  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem('invoice_token')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('invoice_token');
    navigate('/login', { replace: true });
  };

  const navLinkClass = ({ isActive }) =>
    `px-5 py-2 text-sm font-semibold rounded transition-colors ${
      isActive
        ? 'bg-[#0a1f44] text-white'
        : 'text-[#0a1f44] hover:bg-[#0a1f44]/10'
    }`;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gray-100">
      {/* ── Top Navigation Bar ── */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-20">
        <div className="px-6 py-3 flex items-center justify-between">

          {/* Brand */}
          <div className="flex items-center gap-3">
            <img src="/rankfiy logo.png" alt="Rankify" className="h-8 object-contain" />
            <span className="text-[#0a1f44] font-black text-lg tracking-wide hidden sm:block">
              Invoice Studio
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1">
            <NavLink to="/dashboard/invoice" className={navLinkClass}>
              Generate Invoice
            </NavLink>
            <NavLink to="/dashboard/edit-invoice" className={navLinkClass}>
              Edit Invoice
            </NavLink>
            <NavLink to="/dashboard/letterhead" className={navLinkClass}>
              Letter Head
            </NavLink>
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-gray-500 hover:text-[#0a1f44] transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── Page Content ── */}
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
}
