import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
} from 'recharts';
import {
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  Car,
  DollarSign,
  Calendar,
  Layers,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { storageRepository, formatARS } from '../services/storageRepository';
import { ShopAnalyticsData } from '../types';

interface AnalyticsDashboardWidgetProps {
  onVehicleClick?: (make: string, model: string) => void;
}

export const AnalyticsDashboardWidget: React.FC<AnalyticsDashboardWidgetProps> = ({
  onVehicleClick,
}) => {
  const [timeframe, setTimeframe] = useState<'6m' | '12m' | 'all'>('6m');
  const [activeTab, setActiveTab] = useState<'combined' | 'volume_revenue' | 'makes_models'>('combined');
  const [hoveredPieIndex, setHoveredPieIndex] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Compute fresh analytics data based on selected timeframe
  const analyticsData: ShopAnalyticsData = useMemo(() => {
    // refreshKey is used as a dependency to force re-evaluation if requested
    void refreshKey;
    return storageRepository.getShopAnalytics(timeframe);
  }, [timeframe, refreshKey]);

  // Format compact ARS currency for chart axis (e.g. $ 4,5 M)
  const formatShortARS = (amount: number): string => {
    if (amount >= 1000000) {
      return `$ ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$ ${Math.round(amount / 1000)}k`;
    }
    return `$ ${amount}`;
  };

  // Custom Glassmorphic Tooltip for Revenue & Volume Composed Chart
  const CustomComposedTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const rev = payload.find((p: any) => p.dataKey === 'revenue')?.value || 0;
      const vol = payload.find((p: any) => p.dataKey === 'serviceVolume')?.value || 0;
      const ticket = vol > 0 ? Math.round(rev / vol) : 0;

      return (
        <div className="bg-[#131416]/95 backdrop-blur-xl border border-white/20 p-4 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.6)] text-xs min-w-[210px] space-y-2">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-[#F4F7F8] text-sm uppercase tracking-wider">{label}</span>
            <span className="text-[10px] text-[#00CCF2] bg-[#00CCF2]/10 px-2 py-0.5 rounded-full font-mono font-semibold">
              Período Activo
            </span>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#9AA8B6]">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#F27D16]" />
                Facturación Total:
              </span>
              <span className="font-bold text-[#F4F7F8] font-mono">{formatARS(rev)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[#9AA8B6]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00CCF2]" />
                Volumen Servicios:
              </span>
              <span className="font-bold text-[#00CCF2] font-mono">{vol} intervenciones</span>
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-1.5">
              <span className="text-[#9AA8B6]">Ticket Promedio:</span>
              <span className="font-semibold text-[#28C98B] font-mono">{formatARS(ticket)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom Tooltip for Vehicle Makes Donut Chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#131416]/95 backdrop-blur-xl border border-white/20 p-3 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.6)] text-xs min-w-[170px]">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: data.color }} />
            <span className="font-bold text-[#F4F7F8] text-sm">{data.make}</span>
          </div>
          <div className="flex items-center justify-between text-[#9AA8B6] font-mono">
            <span>Vehículos registrados:</span>
            <span className="text-white font-bold">{data.count}</span>
          </div>
          <div className="flex items-center justify-between text-[#9AA8B6] font-mono mt-1">
            <span>Cuota de flota:</span>
            <span className="text-[#00CCF2] font-bold">{data.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section
      id="shop-analytics-widget"
      className="w-full rounded-2xl bg-[#131416]/90 backdrop-blur-xl border border-white/10 p-5 sm:p-7 shadow-[0_12px_36px_rgba(0,0,0,0.45)] mb-8 transition-all"
    >
      {/* Widget Header with Title, Controls & Timeframe Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-[#00CCF2]/10 text-[#00CCF2] border border-[#00CCF2]/20">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#F4F7F8] tracking-tight flex items-center gap-2">
              Telemetría Operativa & Métricas del Taller
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#28C98B]/15 text-[#28C98B] border border-[#28C98B]/30">
                <Sparkles className="w-3 h-3" /> Recharts Live
              </span>
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#9AA8B6]">
            Visualización analítica de volumen mensual de servicios, facturación en pesos ($ ARS) y distribución de marcas/modelos atendidos.
          </p>
        </div>

        {/* Action Controls: View switcher & Timeframe */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Chart View Switcher */}
          <div
            id="analytics-tab-switcher"
            className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-medium"
          >
            <button
              id="tab-combined"
              onClick={() => setActiveTab('combined')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'combined'
                  ? 'bg-gradient-to-r from-[#00CCF2] to-[#00B4D8] text-[#0D0D0D] font-bold shadow-sm'
                  : 'text-[#9AA8B6] hover:text-[#F4F7F8]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>General</span>
            </button>
            <button
              id="tab-volume-revenue"
              onClick={() => setActiveTab('volume_revenue')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'volume_revenue'
                  ? 'bg-gradient-to-r from-[#00CCF2] to-[#00B4D8] text-[#0D0D0D] font-bold shadow-sm'
                  : 'text-[#9AA8B6] hover:text-[#F4F7F8]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Volumen & $</span>
            </button>
            <button
              id="tab-makes-models"
              onClick={() => setActiveTab('makes_models')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'makes_models'
                  ? 'bg-gradient-to-r from-[#00CCF2] to-[#00B4D8] text-[#0D0D0D] font-bold shadow-sm'
                  : 'text-[#9AA8B6] hover:text-[#F4F7F8]'
              }`}
            >
              <PieChartIcon className="w-3.5 h-3.5" />
              <span>Marcas & Modelos</span>
            </button>
          </div>

          {/* Timeframe Selector */}
          <div
            id="analytics-timeframe-selector"
            className="flex items-center p-1 rounded-xl bg-black/40 border border-white/10 text-xs font-medium"
          >
            <button
              id="tf-6m"
              onClick={() => setTimeframe('6m')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === '6m'
                  ? 'bg-white/20 text-white font-bold'
                  : 'text-[#9AA8B6] hover:text-[#F4F7F8]'
              }`}
            >
              6 Meses
            </button>
            <button
              id="tf-12m"
              onClick={() => setTimeframe('12m')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === '12m'
                  ? 'bg-white/20 text-white font-bold'
                  : 'text-[#9AA8B6] hover:text-[#F4F7F8]'
              }`}
            >
              12 Meses
            </button>
            <button
              id="tf-all"
              onClick={() => setTimeframe('all')}
              className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                timeframe === 'all'
                  ? 'bg-white/20 text-white font-bold'
                  : 'text-[#9AA8B6] hover:text-[#F4F7F8]'
              }`}
            >
              Histórico
            </button>
          </div>

          {/* Refresh Action */}
          <button
            id="btn-refresh-analytics"
            onClick={() => setRefreshKey((k) => k + 1)}
            className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-[#9AA8B6] hover:text-[#F4F7F8] transition-all cursor-pointer"
            title="Recalcular métricas"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* KPI Highlight Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
        {/* Total Revenue */}
        <div
          id="kpi-total-revenue"
          className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5 sm:p-4 hover:border-[#F27D16]/40 transition-colors"
        >
          <div className="flex items-center justify-between text-[#9AA8B6] text-xs mb-1.5">
            <span className="font-medium">Facturación Acumulada</span>
            <div className="w-6 h-6 rounded-lg bg-[#F27D16]/15 flex items-center justify-center text-[#F27D16]">
              <DollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[#F4F7F8] tracking-tight">
            {formatARS(analyticsData.totalRevenue)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#28C98B] mt-1 font-medium">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.8% vs período ant.</span>
          </div>
        </div>

        {/* Service Volume */}
        <div
          id="kpi-total-volume"
          className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5 sm:p-4 hover:border-[#00CCF2]/40 transition-colors"
        >
          <div className="flex items-center justify-between text-[#9AA8B6] text-xs mb-1.5">
            <span className="font-medium">Volumen de Servicios</span>
            <div className="w-6 h-6 rounded-lg bg-[#00CCF2]/15 flex items-center justify-center text-[#00CCF2]">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[#00CCF2] tracking-tight">
            {analyticsData.totalServiceVolume}{' '}
            <span className="text-xs font-sans font-normal text-[#9AA8B6]">órdenes</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[#00CCF2] mt-1 font-medium">
            <Calendar className="w-3 h-3" />
            <span>{analyticsData.monthlySeries.length} meses analizados</span>
          </div>
        </div>

        {/* Average Ticket */}
        <div
          id="kpi-average-ticket"
          className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5 sm:p-4 hover:border-[#28C98B]/40 transition-colors"
        >
          <div className="flex items-center justify-between text-[#9AA8B6] text-xs mb-1.5">
            <span className="font-medium">Ticket Promedio</span>
            <div className="w-6 h-6 rounded-lg bg-[#28C98B]/15 flex items-center justify-center text-[#28C98B]">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono text-[#28C98B] tracking-tight">
            {formatARS(analyticsData.averageTicket)}
          </div>
          <div className="text-[11px] text-[#9AA8B6] mt-1">Por intervención en taller</div>
        </div>

        {/* Top Vehicle Make */}
        <div
          id="kpi-top-make"
          className="rounded-xl bg-white/[0.03] border border-white/10 p-3.5 sm:p-4 hover:border-[#7B61FF]/40 transition-colors"
        >
          <div className="flex items-center justify-between text-[#9AA8B6] text-xs mb-1.5">
            <span className="font-medium">Marca Principal</span>
            <div className="w-6 h-6 rounded-lg bg-[#7B61FF]/15 flex items-center justify-center text-[#7B61FF]">
              <Car className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#F4F7F8] truncate">
            {analyticsData.topMake}
          </div>
          <div className="text-[11px] text-[#9AA8B6] mt-1 truncate">
            Modelo líder: <span className="text-[#00CCF2] font-semibold">{analyticsData.topModel}</span>
          </div>
        </div>
      </div>

      {/* Main Visualizations Section */}
      {(activeTab === 'combined' || activeTab === 'volume_revenue') && (
        <div
          id="chart-volume-revenue-container"
          className="rounded-xl bg-black/40 border border-white/10 p-4 sm:p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#F4F7F8] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F27D16]" />
                Evolución de Facturación ($ ARS) vs. Volumen de Servicios
              </h3>
              <p className="text-xs text-[#9AA8B6]">
                Comparativa temporal entre facturación total (barras naranjas) y número de intervenciones realizadas (línea cian).
              </p>
            </div>

            {/* Visual Legend */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#F27D16]" />
                <span className="text-[#9AA8B6]">Facturación ($ ARS)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1 rounded-full bg-[#00CCF2]" />
                <span className="text-[#00CCF2] font-medium">Volumen Servicios</span>
              </div>
            </div>
          </div>

          <div className="h-[320px] sm:h-[360px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={analyticsData.monthlySeries}
                margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="barRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F27D16" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#F21616" stopOpacity={0.65} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="monthLabel"
                  stroke="#9AA8B6"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                />

                {/* Left Y Axis: Revenue in ARS */}
                <YAxis
                  yAxisId="left"
                  stroke="#F27D16"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(242,125,22,0.2)' }}
                  tickFormatter={formatShortARS}
                />

                {/* Right Y Axis: Service Volume count */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#00CCF2"
                  fontSize={10}
                  tickLine={false}
                  axisLine={{ stroke: 'rgba(0,204,242,0.2)' }}
                  tickFormatter={(val) => `${val} u`}
                />

                <Tooltip content={<CustomComposedTooltip />} />

                {/* Revenue Bar */}
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="Facturación"
                  fill="url(#barRevenueGrad)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={44}
                />

                {/* Service Volume Smooth Line */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="serviceVolume"
                  name="Volumen Servicios"
                  stroke="#00CCF2"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#00CCF2', stroke: '#0D0D0D', strokeWidth: 2 }}
                  activeDot={{ r: 6, fill: '#FFFFFF', stroke: '#00CCF2', strokeWidth: 2 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Makes & Models Visualizations Section */}
      {(activeTab === 'combined' || activeTab === 'makes_models') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Vehicle Makes Donut Breakdown (PieChart) */}
          <div
            id="chart-makes-distribution"
            className="lg:col-span-5 rounded-xl bg-black/40 border border-white/10 p-4 sm:p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm sm:text-base font-bold text-[#F4F7F8] flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-[#00CCF2]" />
                  Distribución por Marcas
                </h3>
                <span className="text-[11px] text-[#9AA8B6] font-mono">
                  {analyticsData.makesDistribution.length} marcas
                </span>
              </div>
              <p className="text-xs text-[#9AA8B6] mb-4">
                Porcentaje de participación de cada marca en el parque automotor asistido.
              </p>

              {/* Donut Chart with Recharts */}
              <div className="h-[210px] w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Pie
                      data={analyticsData.makesDistribution}
                      dataKey="count"
                      nameKey="make"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                      onMouseEnter={(_, index) => setHoveredPieIndex(index)}
                      onMouseLeave={() => setHoveredPieIndex(null)}
                    >
                      {analyticsData.makesDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.make}`}
                          fill={entry.color}
                          stroke="#131416"
                          strokeWidth={hoveredPieIndex === index ? 3 : 1.5}
                          style={{
                            filter:
                              hoveredPieIndex === index
                                ? `drop-shadow(0px 0px 8px ${entry.color})`
                                : 'none',
                            cursor: 'pointer',
                          }}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* Donut Center Stat Label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-[#9AA8B6]">Flota Total</span>
                  <span className="text-xl font-bold font-mono text-white">
                    {analyticsData.makesDistribution.reduce((a, b) => a + b.count, 0)}
                  </span>
                  <span className="text-[10px] text-[#00CCF2] font-semibold">unidades</span>
                </div>
              </div>
            </div>

            {/* Legend List of Makes */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/10 mt-2">
              {analyticsData.makesDistribution.slice(0, 6).map((item) => (
                <div
                  key={item.make}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all text-xs"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-semibold text-[#F4F7F8] truncate">{item.make}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[#9AA8B6] shrink-0 ml-1">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Vehicle Models Serviced (Horizontal BarChart) */}
          <div
            id="chart-models-ranking"
            className="lg:col-span-7 rounded-xl bg-black/40 border border-white/10 p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm sm:text-base font-bold text-[#F4F7F8] flex items-center gap-2">
                <Car className="w-4 h-4 text-[#28C98B]" />
                Modelos Más Frecuentes Atendidos
              </h3>
              <span className="text-xs text-[#28C98B] font-mono font-semibold">
                Ranking Operativo
              </span>
            </div>
            <p className="text-xs text-[#9AA8B6] mb-5">
              Modelos de vehículos con mayor recurrencia de intervenciones mecánicas y mantenimientos periódicos.
            </p>

            <div className="h-[270px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analyticsData.modelsRanking}
                  layout="vertical"
                  margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
                >
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="3 3"
                    horizontal={false}
                  />

                  <XAxis
                    type="number"
                    stroke="#9AA8B6"
                    fontSize={10}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.12)' }}
                    tickFormatter={(val) => `${val} unid.`}
                  />

                  <YAxis
                    type="category"
                    dataKey="model"
                    stroke="#F4F7F8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={95}
                    tick={{ fill: '#F4F7F8', fontWeight: 500 }}
                  />

                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-[#131416]/95 backdrop-blur-xl border border-white/20 p-3 rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.6)] text-xs min-w-[190px] space-y-1">
                            <div className="font-bold text-white text-sm">
                              {item.make} {item.model}
                            </div>
                            <div className="flex justify-between text-[#9AA8B6]">
                              <span>Intervenciones registradas:</span>
                              <span className="text-[#00CCF2] font-bold font-mono">
                                {item.count} servicios
                              </span>
                            </div>
                            <div className="flex justify-between text-[#9AA8B6]">
                              <span>Facturación estimada:</span>
                              <span className="text-[#28C98B] font-bold font-mono">
                                {formatARS(item.revenue)}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />

                  <Bar
                    dataKey="count"
                    name="Intervenciones"
                    radius={[0, 6, 6, 0]}
                    fill="#00CCF2"
                    onClick={(entry) => {
                      if (onVehicleClick) {
                        onVehicleClick(entry.make, entry.model);
                      }
                    }}
                  >
                    {analyticsData.modelsRanking.map((entry, index) => {
                      // Alternate bar gradient colors
                      const colors = ['#00CCF2', '#28C98B', '#F27D16', '#7B61FF', '#F5A623'];
                      return (
                        <Cell
                          key={`model-cell-${entry.model}`}
                          fill={colors[index % colors.length]}
                          className="hover:opacity-85 cursor-pointer transition-opacity"
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Chips of Serviced Models */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-white/10">
              <span className="text-[11px] text-[#9AA8B6] font-medium mr-1">Flota destacada:</span>
              {analyticsData.modelsRanking.slice(0, 5).map((m) => (
                <span
                  key={m.model}
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/[0.05] border border-white/10 text-[#F4F7F8]"
                >
                  <span className="text-[#9AA8B6] mr-1">{m.make}</span>
                  <span className="text-[#00CCF2] font-semibold">{m.model}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
