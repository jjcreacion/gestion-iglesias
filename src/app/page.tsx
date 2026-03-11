"use client";

import { Users, MapPin, Grid3X3, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AttendanceChart } from "@/components/dashboard/AttendanceChart";

export default function Dashboard() {
  return (
    <div className="space-y-6 p-4 lg:p-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="title-page">
          Bienvenido
        </h1>
        <p className="text-muted-foreground">
          Resumen general de la congregación • {new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Miembros"
          value="248"
          description="12 nuevos este mes"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Territorios"
          value="6"
          description="Activos"
          icon={MapPin}
          variant="primary"
        />
        <StatCard
          title="Células Activas"
          value="24"
          description="4 en crecimiento"
          icon={Grid3X3}
        />
        <StatCard
          title="Asistencia Domingo"
          value="162"
          description="Último servicio"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
          variant="primary"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Chart - spans 2 columns */}
        <div className="lg:col-span-2">
          <AttendanceChart />
        </div>

        {/* Quick Actions */}
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>

        {/* Upcoming Events Card */}
        <div className="rounded-xl border bg-card p-6 shadow-card animate-fade-in">
          <h3 className="title-section">Próximos Eventos</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-xs font-medium">DOM</span>
                <span className="text-lg font-bold">09</span>
              </div>
              <div>
                <p className="font-medium">Servicio Dominical</p>
                <p className="text-sm text-muted-foreground">10:00 AM - Santuario Principal</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-purple text-purple-foreground">
                <span className="text-xs font-medium">MIÉ</span>
                <span className="text-lg font-bold">12</span>
              </div>
              <div>
                <p className="font-medium">Reunión de Líderes</p>
                <p className="text-sm text-muted-foreground">7:00 PM - Salón de Conferencias</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-info text-info-foreground">
                <span className="text-xs font-medium">SÁB</span>
                <span className="text-lg font-bold">15</span>
              </div>
              <div>
                <p className="font-medium">Encuentro Juvenil</p>
                <p className="text-sm text-muted-foreground">4:00 PM - Área Juvenil</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
