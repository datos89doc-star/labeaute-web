"use client";

import { useState, useEffect } from "react";
import { Lock, LogOut, Calendar as CalendarIcon, Phone, User, Clock, CheckCircle2, XCircle, Search, Activity, Users, LayoutDashboard } from "lucide-react";
import { format, isToday, isThisWeek, isThisMonth } from "date-fns";
import { es } from "date-fns/locale";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'turnos' | 'clientes' | 'estadisticas'>('turnos');
  const [searchQuery, setSearchQuery] = useState("");

  const loadAppointments = () => {
    setLoading(true);
    fetch('/api/appointments')
      .then(res => res.json())
      .then(data => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAppointments();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "2223") {
      setIsAuthenticated(true);
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        loadAppointments();
      } else {
        alert("Error al actualizar");
      }
    } catch (err) {
      alert("Error de conexión");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full border border-pink-50 text-center">
          <div className="w-16 h-16 bg-pink-100 text-[var(--color-secondary)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-serif mb-2 text-[var(--color-foreground)]">Acceso Profesional</h1>
          <p className="text-sm text-gray-500 mb-8">Ingresa tu contraseña para acceder al panel de gestión.</p>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[var(--color-secondary)] mb-6 text-center tracking-widest text-lg font-medium"
            />
            <button className="w-full bg-[var(--color-secondary)] text-white py-3 rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors font-medium tracking-wide shadow-md">
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Derived Data
  const pendingAppointments = appointments.filter(a => a.status === 'PENDING' || !a.status);
  const completedAppointments = appointments.filter(a => a.status === 'COMPLETED');
  
  // Stats
  const completedToday = completedAppointments.filter(a => isToday(new Date(a.date))).length;
  const completedWeek = completedAppointments.filter(a => isThisWeek(new Date(a.date), { weekStartsOn: 1 })).length;
  const completedMonth = completedAppointments.filter(a => isThisMonth(new Date(a.date))).length;

  // Clients grouping
  const clientsMap = new Map();
  appointments.forEach(app => {
    // Only count as visit if completed, but we want to show all in history maybe?
    // Let's show all in history, but calculate total completed visits.
    const key = app.name.toLowerCase().trim();
    if (!clientsMap.has(key)) {
      clientsMap.set(key, {
        name: app.name,
        phone: app.phone,
        history: [],
        completedVisits: 0
      });
    }
    const client = clientsMap.get(key);
    client.history.push(app);
    if (app.status === 'COMPLETED') client.completedVisits += 1;
  });

  const clientsList = Array.from(clientsMap.values())
    .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery));

  // Group pending by date
  const groupedAppointments = pendingAppointments.reduce((acc: any, curr: any) => {
    const dateStr = curr.date.split('T')[0];
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(curr);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Header Admin */}
      <header className="bg-white border-b border-pink-100 p-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--color-secondary)] text-white p-2 rounded-lg">
              <LayoutDashboard size={20} />
            </div>
            <h1 className="text-xl font-serif text-[var(--color-foreground)] hidden sm:block">Panel La Beauté</h1>
          </div>
          
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('turnos')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex gap-2 items-center ${activeTab === 'turnos' ? 'bg-white shadow-sm text-[var(--color-secondary)]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <CalendarIcon size={16} /> <span className="hidden sm:inline">Turnos</span>
            </button>
            <button 
              onClick={() => setActiveTab('clientes')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex gap-2 items-center ${activeTab === 'clientes' ? 'bg-white shadow-sm text-[var(--color-secondary)]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Users size={16} /> <span className="hidden sm:inline">Clientes</span>
            </button>
            <button 
              onClick={() => setActiveTab('estadisticas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex gap-2 items-center ${activeTab === 'estadisticas' ? 'bg-white shadow-sm text-[var(--color-secondary)]' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Activity size={16} /> <span className="hidden sm:inline">Estadísticas</span>
            </button>
          </div>

          <button 
            onClick={() => setIsAuthenticated(false)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2"
            title="Salir"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 py-8">
        
        {loading && <p className="text-center text-gray-400 my-10 animate-pulse">Cargando base de datos...</p>}

        {/* TAB TURNOS PENDIENTES */}
        {!loading && activeTab === 'turnos' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h2 className="text-3xl font-serif text-[var(--color-foreground)]">Turnos Pendientes</h2>
                <p className="text-gray-500 mt-1">Gestiona las reservas que están por venir.</p>
              </div>
            </div>

            {Object.keys(groupedAppointments).length === 0 ? (
              <div className="bg-white p-16 rounded-3xl text-center border border-pink-50 shadow-sm">
                <CalendarIcon className="mx-auto text-pink-200 mb-4" size={64} />
                <p className="text-gray-500 text-lg">No hay turnos pendientes.</p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.keys(groupedAppointments).sort().map(dateStr => {
                  const dateObj = new Date(dateStr + "T00:00:00");
                  const formattedDate = format(dateObj, "EEEE d 'de' MMMM, yyyy", { locale: es });
                  
                  return (
                    <div key={dateStr} className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50">
                      <h3 className="text-lg font-medium text-[var(--color-secondary)] mb-6 capitalize border-b border-pink-50 pb-3 flex items-center gap-2">
                        <CalendarIcon size={20} /> {formattedDate}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {groupedAppointments[dateStr]
                          .sort((a:any, b:any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                          .map((app: any) => {
                            const timeStr = new Date(app.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
                            return (
                              <div key={app.id} className="p-5 rounded-2xl bg-[var(--color-background)] border border-pink-100/50 hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-secondary)]" />
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2 text-gray-800 font-bold text-lg">
                                    <Clock size={18} className="text-[var(--color-secondary)]" />
                                    {timeStr} hs
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 mb-2 text-gray-700 font-medium">
                                  <User size={16} className="text-gray-400" /> {app.name}
                                </div>
                                <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
                                  <Phone size={16} className="text-gray-400" /> 
                                  <a href={`https://wa.me/${app.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">
                                    {app.phone}
                                  </a>
                                </div>
                                <div className="bg-white px-3 py-2 rounded-lg text-xs font-semibold text-[var(--color-foreground)] border border-pink-100 inline-block mb-4">
                                  {app.service}
                                </div>
                                
                                <div className="flex gap-2 mt-2 pt-4 border-t border-gray-200/50">
                                  <button onClick={() => updateStatus(app.id, 'COMPLETED')} className="flex-1 bg-green-50 text-green-600 hover:bg-green-500 hover:text-white py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1">
                                    <CheckCircle2 size={16} /> Completado
                                  </button>
                                  <button onClick={() => updateStatus(app.id, 'CANCELLED')} className="flex-1 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1">
                                    <XCircle size={16} /> Liberar
                                  </button>
                                </div>
                              </div>
                            );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB CLIENTES E HISTORIAL */}
        {!loading && activeTab === 'clientes' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-serif text-[var(--color-foreground)]">Base de Clientes</h2>
                <p className="text-gray-500 mt-1">Busca clientes y revisa su historial de tratamientos.</p>
              </div>
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Buscar por nombre..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-80 pl-12 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-pink-100 outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {clientsList.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-white rounded-3xl border border-gray-100">No se encontraron clientes.</div>
              ) : (
                clientsList.map(client => (
                  <div key={client.name} className="bg-white p-6 rounded-3xl border border-pink-50 shadow-sm flex flex-col md:flex-row gap-8">
                    
                    <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 pb-6 md:pb-0 md:pr-6">
                      <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-[var(--color-secondary)] mb-4">
                        <User size={32} />
                      </div>
                      <h3 className="text-2xl font-serif text-gray-800 mb-1">{client.name}</h3>
                      <p className="text-gray-500 flex items-center gap-2 mb-6">
                        <Phone size={16} /> {client.phone}
                      </p>
                      
                      <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                        <p className="text-sm text-green-600 font-medium mb-1">Servicios Realizados</p>
                        <p className="text-3xl font-bold text-green-700">{client.completedVisits}</p>
                      </div>
                    </div>

                    <div className="md:w-2/3">
                      <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                        <Clock size={18} className="text-gray-400" /> Historial de Turnos
                      </h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {client.history.sort((a:any, b:any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((app:any) => (
                          <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 gap-2">
                            <div>
                              <p className="font-medium text-gray-800">{app.service}</p>
                              <p className="text-sm text-gray-500 capitalize">
                                {format(new Date(app.date), "d MMM, yyyy - HH:mm", {locale:es})} hs
                              </p>
                            </div>
                            <div>
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                app.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                app.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {app.status === 'COMPLETED' ? 'COMPLETADO' : app.status === 'CANCELLED' ? 'CANCELADO' : 'PENDIENTE'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB ESTADISTICAS */}
        {!loading && activeTab === 'estadisticas' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-3xl font-serif text-[var(--color-foreground)] mb-2">Estadísticas de Rendimiento</h2>
            <p className="text-gray-500 mb-8">Resumen de los servicios que han sido marcados como completados.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                  <Activity size={120} />
                </div>
                <p className="text-pink-100 font-medium mb-2">Realizados Hoy</p>
                <p className="text-6xl font-bold mb-4">{completedToday}</p>
                <p className="text-sm text-pink-50">Servicios completados en el día</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                  <CalendarIcon size={120} />
                </div>
                <p className="text-purple-100 font-medium mb-2">Esta Semana</p>
                <p className="text-6xl font-bold mb-4">{completedWeek}</p>
                <p className="text-sm text-purple-50">De lunes a domingo</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[2rem] p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-10">
                  <Activity size={120} />
                </div>
                <p className="text-emerald-100 font-medium mb-2">Este Mes</p>
                <p className="text-6xl font-bold mb-4">{completedMonth}</p>
                <p className="text-sm text-emerald-50">Total acumulado en el mes actual</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
