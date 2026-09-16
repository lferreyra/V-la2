import React, { useState } from 'react';
import { BrandWordmark } from './BrandWordmark';
import {
  Compass,
  FileSearch,
  LayoutDashboard,
  ShieldCheck,
  Building2,
  UserCheck,
  Menu,
  X,
  PlusCircle,
  Sparkles,
  ExternalLink,
  Zap,
  Sun,
  Moon,
  MessageCircle,
  KeyRound,
} from 'lucide-react';
import { UserProfile, UserRole, Workshop } from '../types';
import { WHATSAPP_CONFIG } from '../utils/whatsapp';

interface NavbarProps {
  currentView: 'reception' | 'dashboard' | 'history' | 'landing' | 'new-order' | 'admin';
  onNavigate: (view: 'reception' | 'dashboard' | 'history' | 'landing' | 'new-order' | 'admin') => void;
  currentWorkshop: Workshop;
  allWorkshops: Workshop[];
  onSwitchWorkshop: (workshopId: string) => void;
  currentUser: UserProfile;
  onSwitchRole: (role: UserRole) => void;
  onOpenFirebaseModal: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenAdminLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentWorkshop,
  allWorkshops,
  onSwitchWorkshop,
  currentUser,
  onSwitchRole,
  onOpenFirebaseModal,
  theme = 'dark',
  onToggleTheme,
  onOpenAdminLogin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showWorkshopMenu, setShowWorkshopMenu] = useState(false);

  const roleColors: Record<UserRole, { badge: string; text: string; dot: string }> = {
    admin: {
      badge: 'bg-[#F21616]/15 border-[#F21616]/40 text-[#F21616]',
      text: 'Admin',
      dot: 'bg-[#F21616]',
    },
    advisor: {
      badge: 'bg-[#00CCF2]/15 border-[#00CCF2]/40 text-[#00CCF2]',
      text: 'Asesor',
      dot: 'bg-[#00CCF2]',
    },
    technician: {
      badge: 'bg-[#F27D16]/15 border-[#F27D16]/40 text-[#F27D16]',
      text: 'Técnico',
      dot: 'bg-[#F27D16]',
    },
  };

  const navItems = [
    { id: 'reception', label: 'Recepción', icon: FileSearch },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Historial', icon: Compass },
    { id: 'admin', label: 'Panel Admin', icon: ShieldCheck },
    { id: 'landing', label: 'Web Pública', icon: ExternalLink },
  ] as const;

  return (
    <>
      <header
        className="sticky top-0 z-40 w-full bg-[#0D0D0D]/85 backdrop-blur-2xl border-b border-white/[0.08]"
        id="main-header"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Wordmark with subtle hover glow */}
            <div
              className="cursor-pointer transition-transform duration-300 hover:scale-[1.02]"
              onClick={() => onNavigate('reception')}
              id="nav-brand-click"
            >
              <BrandWordmark compact={false} />
            </div>

            {/* Desktop Navigation Links (Floating Glass Pill Design) */}
            <nav
              className="hidden md:flex items-center p-1.5 rounded-full bg-[#131416]/90 backdrop-blur-xl border border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.4)] space-x-1"
              id="desktop-navigation"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-[#00CCF2] to-[#00B4D8] text-[#0D0D0D] font-bold shadow-[0_0_20px_rgba(0,204,242,0.35)]'
                        : 'text-[#9AA8B6] hover:text-[#F4F7F8] hover:bg-white/[0.05]'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0D0D0D]' : 'text-[#9AA8B6]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Area: Workshop Switcher + Role + Firebase */}
            <div className="hidden lg:flex items-center space-x-3" id="nav-system-controls">
              {/* Workshop Selector (Multi-Tenant isolation proof) */}
              <div className="relative">
                <button
                  id="btn-workshop-picker"
                  onClick={() => {
                    setShowWorkshopMenu(!showWorkshopMenu);
                    setShowRoleMenu(false);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#131416]/90 backdrop-blur-xl border border-white/[0.08] text-xs text-[#F4F7F8] hover:border-[#00CCF2]/50 hover:bg-[#1A1C20] transition-all cursor-pointer shadow-sm"
                  title="Aislamiento de taller (Multi-Tenant)"
                >
                  <Building2 className="w-3.5 h-3.5 text-[#00CCF2]" />
                  <span className="max-w-[140px] truncate font-medium">{currentWorkshop.name}</span>
                </button>

                {showWorkshopMenu && (
                  <div
                    id="dropdown-workshop-menu"
                    className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#131416]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.6)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-2 border-b border-white/[0.08] mb-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#00CCF2]">
                        Aislamiento Multi-Taller
                      </p>
                      <p className="text-[10px] text-[#9AA8B6]">
                        Datos estrictamente particionados por workshopId
                      </p>
                    </div>
                    {allWorkshops.map((ws) => (
                      <button
                        key={ws.id}
                        id={`select-workshop-${ws.id}`}
                        onClick={() => {
                          onSwitchWorkshop(ws.id);
                          setShowWorkshopMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex flex-col transition-all cursor-pointer ${
                          ws.id === currentWorkshop.id
                            ? 'bg-[#00CCF2]/15 text-[#00CCF2] font-bold border border-[#00CCF2]/30 shadow-sm'
                            : 'text-[#F4F7F8] hover:bg-white/[0.06]'
                        }`}
                      >
                        <span className="font-semibold">{ws.name}</span>
                        <span className="text-[10px] text-[#9AA8B6] font-mono">ID: {ws.id}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Role Switcher Pill */}
              <div className="relative">
                <button
                  id="btn-role-picker"
                  onClick={() => {
                    setShowRoleMenu(!showRoleMenu);
                    setShowWorkshopMenu(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-semibold backdrop-blur-xl transition-all cursor-pointer shadow-sm ${
                    roleColors[currentUser.role].badge
                  }`}
                  title="Cambiar rol activo para probar permisos"
                >
                  <span className={`w-2 h-2 rounded-full ${roleColors[currentUser.role].dot}`} />
                  <span>{roleColors[currentUser.role].text}</span>
                </button>

                {showRoleMenu && (
                  <div
                    id="dropdown-role-menu"
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#131416]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.6)] p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-2 border-b border-white/[0.08] mb-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#00CCF2]">
                        Simular Rol (RBAC)
                      </p>
                      <p className="text-[10px] text-[#9AA8B6]">{currentUser.displayName}</p>
                    </div>
                    {(['admin', 'advisor', 'technician'] as UserRole[]).map((r) => (
                      <button
                        key={r}
                        id={`select-role-${r}`}
                        onClick={() => {
                          onSwitchRole(r);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          r === currentUser.role
                            ? 'bg-white/[0.08] text-[#00CCF2] font-bold'
                            : 'text-[#F4F7F8] hover:bg-white/[0.04]'
                        }`}
                      >
                        <span>
                          {r === 'admin' && 'Administrador (Full)'}
                          {r === 'advisor' && 'Asesor de Servicio'}
                          {r === 'technician' && 'Técnico de Taller'}
                        </span>
                        {r === currentUser.role && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00CCF2]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* WhatsApp Turnos Button */}
              <a
                id="btn-nav-whatsapp"
                href={WHATSAPP_CONFIG.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-xs font-bold text-[#25D366] transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
                title={`Solicitar turno por WhatsApp (${WHATSAPP_CONFIG.displayPhone})`}
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span className="hidden xl:inline">Turnos WhatsApp</span>
              </a>

              {/* Admin Login / Access Button */}
              <button
                id="btn-nav-admin-login"
                type="button"
                onClick={onOpenAdminLogin}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold transition-all cursor-pointer shadow-sm ${
                  currentUser.role === 'admin'
                    ? 'bg-[#F21616]/15 border-[#F21616]/40 text-[#F21616] hover:bg-[#F21616]/25'
                    : 'bg-[#131416]/90 border-white/[0.1] text-[#F4F7F8] hover:border-[#00CCF2]/50 hover:bg-[#1A1C20]'
                }`}
                title={
                  currentUser.role === 'admin'
                    ? 'Sesión de Administrador activa (ADMIN)'
                    : 'Acceso Administrador (Usuario: ADMIN / PANCHO2026)'
                }
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {currentUser.role === 'admin' ? 'ADMIN Activo' : 'Acceso Admin'}
                </span>
              </button>

              {/* Theme Selector (Modo Claro / Modo Oscuro) */}
              <button
                id="btn-toggle-theme"
                type="button"
                onClick={onToggleTheme}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#131416]/90 backdrop-blur-xl border border-white/[0.08] text-xs font-semibold text-[#F4F7F8] hover:border-[#00CCF2]/50 hover:bg-[#1A1C20] transition-all cursor-pointer shadow-sm group"
                title={theme === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
                aria-label="Cambiar tema claro / oscuro"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#00CCF2] group-hover:-rotate-12 transition-transform" />
                    <span className="hidden xl:inline font-medium">Modo Oscuro</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#F27D16] group-hover:rotate-45 transition-transform" />
                    <span className="hidden xl:inline font-medium">Modo Claro</span>
                  </>
                )}
              </button>

              {/* Firebase & Security Status Button */}
              <button
                id="btn-firebase-modal"
                onClick={onOpenFirebaseModal}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#00CCF2]/10 hover:bg-[#00CCF2]/20 text-[#00CCF2] border border-[#00CCF2]/30 text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,204,242,0.15)] cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#00CCF2]" />
                <span>10 Tests & Reglas</span>
              </button>
            </div>

            {/* Mobile menu toggle */}
            <div className="flex md:hidden items-center gap-2">
              {/* Mobile WhatsApp Button */}
              <a
                id="btn-mobile-whatsapp"
                href={WHATSAPP_CONFIG.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/40"
                title="Sacar turno por WhatsApp"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>

              {/* Mobile Admin Login Button */}
              <button
                id="btn-mobile-admin-login"
                type="button"
                onClick={onOpenAdminLogin}
                className={`p-2.5 rounded-full border ${
                  currentUser.role === 'admin'
                    ? 'bg-[#F21616]/20 text-[#F21616] border-[#F21616]/40'
                    : 'bg-[#131416] text-[#F4F7F8] border-white/[0.1]'
                }`}
                title="Acceso Admin (ADMIN / PANCHO2026)"
              >
                <KeyRound className="w-4 h-4" />
              </button>

              <button
                id="btn-mobile-theme"
                type="button"
                onClick={onToggleTheme}
                className="p-2.5 rounded-full bg-[#131416] text-[#F4F7F8] border border-white/[0.1] hover:border-[#00CCF2]/40 transition-colors"
                title={theme === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
                aria-label="Cambiar tema claro / oscuro"
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 text-[#00CCF2]" />
                ) : (
                  <Sun className="w-4 h-4 text-[#F27D16]" />
                )}
              </button>
              <button
                id="btn-mobile-firebase"
                onClick={onOpenFirebaseModal}
                className="p-2.5 rounded-full bg-[#131416] text-[#00CCF2] border border-white/[0.1]"
                aria-label="Firebase config"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
              <button
                id="btn-mobile-menu"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-full bg-[#131416] text-[#F4F7F8] border border-white/[0.1] focus:outline-none"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div
            className="md:hidden border-t border-white/[0.08] bg-[#0D0D0D]/95 backdrop-blur-2xl px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-3 duration-200"
            id="mobile-menu-drawer"
          >
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`mobile-nav-${item.id}`}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#00CCF2] to-[#00B4D8] text-[#0D0D0D] font-bold shadow-[0_0_20px_rgba(0,204,242,0.3)]'
                        : 'text-[#9AA8B6] bg-[#131416] border border-white/[0.06]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0D0D0D]' : 'text-[#9AA8B6]'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-[#131416] border border-white/[0.08] space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#9AA8B6]">Taller Activo:</span>
                <span className="font-bold text-[#F4F7F8] truncate max-w-[180px]">
                  {currentWorkshop.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9AA8B6]">Rol Actual:</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${
                    roleColors[currentUser.role].badge
                  }`}
                >
                  {roleColors[currentUser.role].text}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/[0.06]">
                {(['admin', 'advisor', 'technician'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    id={`mobile-role-switch-${r}`}
                    onClick={() => onSwitchRole(r)}
                    className={`py-2 rounded-xl text-[11px] font-medium text-center border transition-all ${
                      r === currentUser.role
                        ? 'bg-[#00CCF2] text-[#0D0D0D] font-bold border-[#00CCF2]'
                        : 'bg-[#1A1C20] text-[#9AA8B6] border-white/[0.05]'
                    }`}
                  >
                    {r === 'admin' ? 'Admin' : r === 'advisor' ? 'Asesor' : 'Técnico'}
                  </button>
                ))}
              </div>

              {/* Mobile WhatsApp CTA */}
              <div className="pt-2 border-t border-white/[0.06]">
                <a
                  id="btn-mobile-menu-whatsapp"
                  href={WHATSAPP_CONFIG.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Sacar Turno por WhatsApp ({WHATSAPP_CONFIG.displayPhone})</span>
                </a>
              </div>

              {/* Mobile Admin Login Access */}
              <div className="pt-1">
                <button
                  type="button"
                  id="btn-mobile-menu-admin-login"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenAdminLogin) onOpenAdminLogin();
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    currentUser.role === 'admin'
                      ? 'bg-[#F21616]/15 border-[#F21616]/30 text-[#F21616]'
                      : 'bg-[#1A1C20] border-white/[0.08] text-[#F4F7F8]'
                  }`}
                >
                  <KeyRound className="w-4 h-4" />
                  <span>
                    {currentUser.role === 'admin'
                      ? 'Sesión de Admin Activa (ADMIN)'
                      : 'Acceso Admin (Usuario: ADMIN / PANCHO2026)'}
                  </span>
                </button>
              </div>

              {/* Mobile Theme Toggle Section */}
              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[#9AA8B6]">Tema Visual:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    id="btn-mobile-set-light"
                    onClick={() => {
                      if (theme !== 'light' && onToggleTheme) onToggleTheme();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                      theme === 'light'
                        ? 'bg-[#00CCF2] text-[#0D0D0D] font-bold shadow-sm'
                        : 'bg-[#1A1C20] text-[#9AA8B6] border border-white/[0.05]'
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5" />
                    <span>Claro</span>
                  </button>
                  <button
                    type="button"
                    id="btn-mobile-set-dark"
                    onClick={() => {
                      if (theme !== 'dark' && onToggleTheme) onToggleTheme();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                      theme === 'dark'
                        ? 'bg-[#00CCF2] text-[#0D0D0D] font-bold shadow-sm'
                        : 'bg-[#1A1C20] text-[#9AA8B6] border border-white/[0.05]'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Oscuro</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Floating Framer-Style Bottom Quick Dock (visible on mobile & tablet) */}
      <div className="md:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm">
        <div className="glass-panel p-2 rounded-full border border-white/10 shadow-[0_16px_36px_rgba(0,0,0,0.6)] flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`p-3 rounded-full transition-all ${
                  isActive
                    ? 'bg-[#00CCF2] text-[#0D0D0D] shadow-[0_0_16px_rgba(0,204,242,0.4)] scale-105'
                    : 'text-[#9AA8B6] hover:text-[#F4F7F8]'
                }`}
                title={item.label}
              >
                <Icon className="w-5 h-5" />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
