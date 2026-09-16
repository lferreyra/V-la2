/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ReceptionView } from './components/ReceptionView';
import { DashboardView } from './components/DashboardView';
import { VehicleHistoryView } from './components/VehicleHistoryView';
import { ServiceOrderForm } from './components/ServiceOrderForm';
import { PublicLandingView } from './components/PublicLandingView';
import { AdminPanelView } from './components/AdminPanelView';
import { FirebaseModal } from './components/FirebaseModal';
import { AmbientBackground } from './components/AmbientBackground';
import { WhatsAppWidget } from './components/WhatsAppWidget';
import { AdminLoginModal } from './components/AdminLoginModal';
import { storageRepository } from './services/storageRepository';
import { Client, ServiceOrder, UserProfile, UserRole, Vehicle, Workshop } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'reception' | 'dashboard' | 'history' | 'landing' | 'new-order' | 'admin'
  >('reception');

  // Theme mode: 'dark' | 'light'
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vla_theme_mode');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    }
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      document.body.classList.add('light');
      document.body.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    }
    localStorage.setItem('vla_theme_mode', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      showToast(`Modo cambiado a: ${next === 'light' ? 'Claro ☀️' : 'Oscuro 🌙'}`);
      return next;
    });
  };

  // Multi-tenant and User states
  const [currentWorkshop, setCurrentWorkshop] = useState<Workshop>(
    storageRepository.getCurrentWorkshop(),
  );
  const [allWorkshops, setAllWorkshops] = useState<Workshop[]>(
    storageRepository.getWorkshops(),
  );
  const [currentUser, setCurrentUser] = useState<UserProfile>(
    storageRepository.getCurrentUser(),
  );

  // Active Order / History target context
  const [targetVehicle, setTargetVehicle] = useState<Vehicle | null>(null);
  const [targetClient, setTargetClient] = useState<Client | null>(null);
  const [editingOrder, setEditingOrder] = useState<ServiceOrder | undefined>(undefined);
  const [targetHistoryVehicleId, setTargetHistoryVehicleId] = useState<string | undefined>(
    undefined,
  );

  // Modals & Notifications
  const [showFirebaseModal, setShowFirebaseModal] = useState<boolean>(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  // Workshop switch handler
  const handleSwitchWorkshop = (workshopId: string) => {
    storageRepository.switchWorkshop(workshopId);
    setCurrentWorkshop(storageRepository.getCurrentWorkshop());
    // Reset order/history targets when changing workshop to avoid cross-tenant leaks
    setTargetVehicle(null);
    setTargetClient(null);
    setEditingOrder(undefined);
    setTargetHistoryVehicleId(undefined);
    showToast(`Cambiado a taller: ${storageRepository.getCurrentWorkshop().name}`);
  };

  // Role switch handler
  const handleSwitchRole = (newRole: UserRole) => {
    storageRepository.switchUserRole(newRole);
    setCurrentUser(storageRepository.getCurrentUser());
    showToast(`Rol cambiado a: ${newRole.toUpperCase()}`);
  };

  // Reception Action: Start New Order
  const handleStartNewOrder = (vehicle: Vehicle, client: Client) => {
    setTargetVehicle(vehicle);
    setTargetClient(client);
    setEditingOrder(undefined);
    setCurrentView('new-order');
  };

  // Reception / Dashboard Action: View Vehicle History
  const handleViewHistory = (vehicleId: string) => {
    setTargetHistoryVehicleId(vehicleId);
    setCurrentView('history');
  };

  // Dashboard Action: Edit/Manage Existing Order
  const handleEditOrder = (order: ServiceOrder) => {
    const vResult = storageRepository.searchVehicleByPlate(order.licensePlate);
    if (vResult) {
      setTargetVehicle(vResult.vehicle);
      setTargetClient(vResult.client);
      setEditingOrder(order);
      setCurrentView('new-order');
    } else {
      showToast('No se encontró el vehículo asociado a esta orden.');
    }
  };

  // Order Form Action: Save Success
  const handleOrderSaveSuccess = (order: ServiceOrder) => {
    showToast(`Orden ${order.orderNumber} guardada exitosamente.`);
    // Automatically redirect to vehicle history to inspect the updated timeline
    setTargetHistoryVehicleId(order.vehicleId);
    setCurrentView('history');
  };

  return (
    <div
      className={`relative min-h-screen ${
        theme === 'light' ? 'light bg-[#F4F6F8] text-[#0F172A]' : 'dark bg-[#0D0D0D] text-[#F4F7F8]'
      } flex flex-col selection:bg-[#00CCF2]/30 selection:text-[#00CCF2] transition-colors duration-250`}
    >
      {/* Dynamic Framer / Webflow Ambient Aurora & Parallax Backdrop */}
      <AmbientBackground />

      {/* Floating Toast Notification Banner */}
      {toastMessage && (
        <div
          id="system-toast"
          className="fixed top-24 right-4 z-50 px-4 py-3 rounded-2xl glass-panel border border-[#00CCF2]/40 text-xs font-semibold text-[#F4F7F8] shadow-[0_12px_36px_rgba(0,0,0,0.6)] flex items-center gap-2.5 animate-in fade-in slide-in-from-top-3 duration-200"
        >
          <div className="w-2 h-2 rounded-full bg-[#00CCF2] animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        currentWorkshop={currentWorkshop}
        allWorkshops={allWorkshops}
        onSwitchWorkshop={handleSwitchWorkshop}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenFirebaseModal={() => setShowFirebaseModal(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenAdminLogin={() => setShowAdminLoginModal(true)}
      />

      {/* Main Content Rendered based on currentView */}
      <main className="relative z-10 flex-1 w-full pb-20 sm:pb-12" id="app-main-content">
        {currentView === 'reception' && (
          <ReceptionView
            onStartNewOrder={handleStartNewOrder}
            onViewHistory={handleViewHistory}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            onSelectVehicleHistory={handleViewHistory}
            onEditOrder={handleEditOrder}
            onGoToReception={() => setCurrentView('reception')}
          />
        )}

        {currentView === 'history' && (
          <VehicleHistoryView
            initialVehicleId={targetHistoryVehicleId}
            onNewOrder={handleStartNewOrder}
          />
        )}

        {currentView === 'admin' && (
          <AdminPanelView
            currentUser={currentUser}
            onSwitchRole={handleSwitchRole}
            onNavigateToReception={() => setCurrentView('reception')}
            onOpenAdminLogin={() => setShowAdminLoginModal(true)}
          />
        )}

        {currentView === 'new-order' && targetVehicle && targetClient && (
          <ServiceOrderForm
            vehicle={targetVehicle}
            client={targetClient}
            existingOrder={editingOrder}
            onSaveSuccess={handleOrderSaveSuccess}
            onCancel={() => setCurrentView('reception')}
          />
        )}

        {currentView === 'landing' && (
          <PublicLandingView onEnterApp={() => setCurrentView('reception')} />
        )}
      </main>

      {/* Floating WhatsApp Bubble & Quick Turno CTA */}
      <WhatsAppWidget />

      {/* Admin Authentication Modal (User: ADMIN / Pass: PANCHO2026) */}
      <AdminLoginModal
        isOpen={showAdminLoginModal}
        onClose={() => setShowAdminLoginModal(false)}
        currentUser={currentUser}
        onLoginSuccess={(authedUser) => {
          setCurrentUser(authedUser);
          showToast(`¡Sesión iniciada con éxito como ${authedUser.username || authedUser.displayName}!`);
        }}
        onLogout={() => {
          storageRepository.logoutUser();
          setCurrentUser(storageRepository.getCurrentUser());
          showToast('Sesión de administrador cerrada correctamente.');
        }}
      />

      {/* Firebase & Security Test Suite Modal */}
      <FirebaseModal
        isOpen={showFirebaseModal}
        onClose={() => setShowFirebaseModal(false)}
      />

      {/* Glassmorphic Footer */}
      <footer
        className="relative z-10 w-full bg-[#0D0D0D]/80 backdrop-blur-2xl border-t border-white/[0.08] py-6 px-4 text-center text-xs text-[#9AA8B6]"
        id="app-footer"
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            © {new Date().getFullYear()} <strong>V-LA Taller Mecánico</strong> · Gestión integral, registro técnico y orden por matrícula.
          </p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-[#00CCF2] flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#00CCF2] animate-pulse" />
              Sistema Online
            </span>
            <span>Aislamiento: <strong className="text-[#F4F7F8] font-mono">{currentWorkshop.id}</strong></span>
            <span>Usuario: <strong className="text-[#F4F7F8]">{currentUser.displayName}</strong></span>
          </div>
        </div>
      </footer>
    </div>
  );
}
