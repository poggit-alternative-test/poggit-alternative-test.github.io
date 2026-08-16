import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Menu, X, Package, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function Header() {
  const { colors, resolvedMode, toggleMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkStyle = (isActive: boolean) => ({
    fontSize: '14px',
    fontWeight: 500,
    color: isActive ? colors.textPrimary : colors.textMuted,
    textDecoration: 'none',
    padding: '6px 12px',
    borderRadius: '8px',
    transition: 'all 0.15s ease',
    backgroundColor: isActive ? colors.card : 'transparent',
  });

  const iconBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    color: colors.textMuted,
    transition: 'all 0.15s ease',
    flexShrink: 0,
  };

  return (
    <header
      style={{
        height: '56px',
        borderBottom: `1px solid ${colors.border}`,
        backgroundColor: colors.bg,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          paddingLeft: '24px',
          paddingRight: '24px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* ── Left: Logo + Nav ─────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            aria-label="Axolotl Plugin Registry home"
          >
            <img
              src="/axolotl-logo.svg"
              alt="Axolotl Plugin Registry"
              style={{ height: '32px', width: 'auto' }}
            />
          </Link>

          {/* Desktop nav — hidden on mobile via CSS */}
          <nav
            className="desktop-nav"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <NavLink to="/" end style={({ isActive }) => navLinkStyle(isActive)}>
              Browse
            </NavLink>
            <NavLink to="/plugins" style={({ isActive }) => navLinkStyle(isActive)}>
              Plugins
            </NavLink>
            <NavLink to="/about" style={({ isActive }) => navLinkStyle(isActive)}>
              About
            </NavLink>
          </nav>
        </div>

        {/* ── Right: Actions ──────────────────────────────── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {/* Search icon — desktop only */}
          <Link
            to="/plugins"
            className="hide-on-tablet"
            style={iconBtnStyle}
            aria-label="Browse plugins"
          >
            <Search size={18} />
          </Link>

          {/* Theme toggle */}
          <button
            onClick={toggleMode}
            style={iconBtnStyle}
            aria-label={`Switch to ${resolvedMode === 'dark' ? 'light' : 'dark'} mode`}
          >
            {resolvedMode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Mobile hamburger — hidden on desktop (≥1024px) via CSS */}
          <button
            className="hide-on-tablet"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={iconBtnStyle}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ─────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '56px',
            left: 0,
            right: 0,
            backgroundColor: colors.bg,
            borderBottom: `1px solid ${colors.border}`,
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              color: colors.textPrimary,
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            <Package size={16} />
            Browse
          </Link>
          <Link
            to="/plugins"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              color: colors.textPrimary,
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            <Search size={16} />
            Plugins
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '8px',
              color: colors.textPrimary,
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            About
          </Link>
        </div>
      )}
    </header>
  );
}
