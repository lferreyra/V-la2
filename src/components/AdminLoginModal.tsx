import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  X,
  CheckCircle2,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { storageRepository } from '../services/storageRepository';
import { UserProfile } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile) => void;
  onLogout: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAdminLoggedIn =
    currentUser.role === 'admin' &&
    (currentUser.username === 'ADMIN' || currentUser.uid === 'usr-admin-vla');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const result = storageRepository.authenticateUser(username, password);
    if (result.success && result.user) {
      setSuccessMsg(result.message);
      setTimeout(() => {
        onLoginSuccess(result.user!);
        onClose();
      }, 500);
    } else {
      setErrorMsg(result.message || 'Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div
      id="modal-admin-login"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-[#131416] border border-white/[0.12] shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Modal Header */}
        <div className="relative p-6 pb-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F21616] to-[#F27D16] text-white flex items-center justify-center shadow-[0_0_20px_rgba(242,22,22,0.4)]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#F4F7F8] tracking-tight">
                Acceso de Administrador
              </h3>
              <p className="text-[11px] text-[#9AA8B6]">Gestión de Taller y Seguridad RBAC</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#9AA8B6] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Cerrar ventana de login"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Active Status Display */}
          {isAdminLoggedIn ? (
            <div className="p-4 rounded-2xl bg-[#00CCF2]/10 border border-[#00CCF2]/30 space-y-3">
              <div className="flex items-center gap-2 text-[#00CCF2] font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>Sesión Activa: Administrador General (ADMIN)</span>
              </div>
              <p className="text-xs text-[#9AA8B6] leading-relaxed">
                Actualmente tienes permisos completos sobre el catálogo de servicios, órdenes de trabajo, horarios de agenda y sincronización con Google Calendar.
              </p>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  setSuccessMsg('Has cerrado sesión como Administrador.');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-white/[0.08] hover:bg-[#F21616]/20 hover:text-[#F21616] border border-white/[0.1] text-xs font-semibold text-[#F4F7F8] flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión de Admin</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F4F7F8] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#9AA8B6]" />
                  <span>Usuario</span>
                </label>
                <input
                  id="admin-login-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  className="w-full px-4 py-3 rounded-xl bg-[#1A1C20] border border-white/[0.1] text-sm text-[#F4F7F8] placeholder-[#9AA8B6]/60 focus:border-[#00CCF2] focus:ring-1 focus:ring-[#00CCF2] outline-none font-mono"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#F4F7F8] flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#9AA8B6]" />
                  <span>Contraseña</span>
                </label>
                <div className="relative">
                  <input
                    id="admin-login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-11 py-3 rounded-xl bg-[#1A1C20] border border-white/[0.1] text-sm text-[#F4F7F8] placeholder-[#9AA8B6]/60 focus:border-[#00CCF2] focus:ring-1 focus:ring-[#00CCF2] outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9AA8B6] hover:text-white p-1 cursor-pointer"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-[#F21616]/15 border border-[#F21616]/40 text-[#F21616] text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="p-3 rounded-xl bg-[#00CCF2]/15 border border-[#00CCF2]/40 text-[#00CCF2] text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                id="btn-admin-login-submit"
                type="submit"
                className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#00CCF2] via-[#00B4D8] to-[#0099B8] hover:brightness-110 text-[#0D0D0D] font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(0,204,242,0.35)] cursor-pointer active:scale-[0.98]"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Ingresar como Administrador</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
