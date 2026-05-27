"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, User, Phone, CheckCircle2, ChevronRight } from "lucide-react";
import Link from "next/link";
import { addDays, format, startOfToday } from "date-fns";
import { es } from "date-fns/locale";

const SERVICES = [
  "Masaje Descontracturante",
  "Masajes Relajantes",
  "Combo Facial Premium",
  "Hidralips"
];

const TIME_SLOTS_MORNING = ["09:00", "09:45", "10:30", "11:15", "12:00"];
const TIME_SLOTS_AFTERNOON = ["17:00", "17:45", "18:30", "19:15", "20:00"];

export default function ReservarPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    date: "",
    time: "",
    name: "",
    phone: ""
  });
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Generar próximos 15 días disponibles (sin domingos)
  const availableDays = Array.from({ length: 21 })
    .map((_, i) => addDays(startOfToday(), i))
    .filter(d => d.getDay() !== 0);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!formData.date) return;
    
    fetch('/api/appointments')
      .then(res => res.json())
      .then((data: any[]) => {
        // Un slot está ocupado si el turno está PENDING o COMPLETED. Solo se ignoran los CANCELLED.
        const slotsForDate = data
          .filter(a => a.date.startsWith(formData.date) && a.status !== 'CANCELLED')
          .map(a => new Date(a.date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false }));
        setBookedSlots(slotsForDate);
      })
      .catch(err => console.error(err));
  }, [formData.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const dateTimeStr = `${formData.date}T${formData.time}:00-03:00`;
      
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          service: formData.service,
          date: dateTimeStr
        })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert("El turno ya no está disponible o hubo un error.");
      }
    } catch (error) {
      alert("Error al reservar el turno.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableTimeSlots = () => {
    if (!formData.date) return [];
    const dateObj = new Date(formData.date + "T00:00:00");
    const day = dateObj.getDay();
    
    if (day === 0) return []; // Sunday
    if (day === 6) return TIME_SLOTS_MORNING; // Saturday
    return [...TIME_SLOTS_MORNING, ...TIME_SLOTS_AFTERNOON];
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-pink-50"
        >
          <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-serif text-[var(--color-foreground)] mb-4">¡Turno Reservado!</h2>
          <p className="text-gray-600 mb-8 font-light">
            Gracias {formData.name}. Tu turno para {formData.service} el día {format(new Date(formData.date+"T00:00:00"), "d 'de' MMMM", {locale:es})} a las {formData.time} hs ha sido confirmado.
          </p>
          <Link href="/" className="inline-block bg-[var(--color-secondary)] text-white px-8 py-3 rounded-full hover:bg-[var(--color-primary-dark)] transition-all">
            Volver al inicio
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-secondary)] mb-8 transition-colors">
          <ArrowLeft size={20} /> Volver
        </Link>
        
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-12 border border-pink-50">
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--color-foreground)] mb-8 text-center">Reservar Turno</h1>
          
          {/* Progress Steps */}
          <div className="flex justify-center items-center gap-4 mb-12">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[var(--color-secondary)] text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
            <div className={`w-16 h-1 rounded-full ${step >= 2 ? 'bg-[var(--color-secondary)]' : 'bg-gray-100'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[var(--color-secondary)] text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
            <div className={`w-16 h-1 rounded-full ${step >= 3 ? 'bg-[var(--color-secondary)]' : 'bg-gray-100'}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[var(--color-secondary)] text-white' : 'bg-gray-100 text-gray-400'}`}>3</div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-xl font-medium mb-6 text-center">Selecciona un servicio</h3>
                <div className="space-y-3">
                  {SERVICES.map(service => (
                    <div 
                      key={service}
                      onClick={() => setFormData({...formData, service})}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.service === service ? 'border-[var(--color-secondary)] bg-pink-50/30 shadow-md' : 'border-gray-100 hover:border-pink-200'}`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-gray-800 font-medium">{service}</span>
                        {formData.service === service && <CheckCircle2 className="text-[var(--color-secondary)]" size={20} />}
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  type="button"
                  disabled={!formData.service}
                  onClick={() => setStep(2)}
                  className="w-full mt-8 bg-[var(--color-foreground)] text-white py-4 rounded-xl disabled:opacity-50 hover:bg-gray-800 transition-colors"
                >
                  Continuar
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-xl font-medium mb-6 text-center text-gray-800">Elige el día</h3>
                
                {/* Calendario Horizontal Interactivo */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-8 snap-x scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                  {availableDays.map(dateObj => {
                    const dateStr = format(dateObj, 'yyyy-MM-dd');
                    const isSelected = formData.date === dateStr;
                    return (
                      <div 
                        key={dateStr}
                        onClick={() => setFormData({...formData, date: dateStr, time: ""})}
                        className={`flex-shrink-0 snap-center w-20 h-24 rounded-2xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-white shadow-lg scale-105' 
                            : 'border-gray-200 bg-white text-gray-600 hover:border-pink-300'
                        }`}
                      >
                        <span className={`text-xs uppercase font-semibold tracking-wider ${isSelected ? 'text-pink-100' : 'text-gray-400'}`}>
                          {format(dateObj, 'EEE', {locale: es})}
                        </span>
                        <span className="text-3xl font-serif mt-1 mb-1">{format(dateObj, 'd')}</span>
                        <span className={`text-[10px] uppercase font-medium ${isSelected ? 'text-pink-100' : 'text-gray-400'}`}>
                          {format(dateObj, 'MMM', {locale: es})}
                        </span>
                      </div>
                    )
                  })}
                </div>

                {formData.date && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <h3 className="text-xl font-medium mb-6 text-center text-gray-800">Horarios disponibles</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
                      {getAvailableTimeSlots().map(time => {
                        const isBooked = bookedSlots.includes(time);
                        return (
                          <div 
                            key={time}
                            onClick={() => !isBooked && setFormData({...formData, time})}
                            className={`p-4 rounded-xl text-center border-2 transition-all font-medium ${
                              isBooked 
                                ? 'bg-red-50 border-red-200 text-red-500 cursor-not-allowed shadow-[inset_0_0_10px_rgba(239,68,68,0.1)] opacity-70 relative overflow-hidden' 
                                : formData.time === time 
                                  ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)] text-white shadow-lg cursor-pointer transform scale-105' 
                                  : 'border-gray-200 bg-white hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] text-gray-700 cursor-pointer'
                            }`}
                          >
                            {isBooked && (
                              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                                <div className="w-full h-px bg-red-500 rotate-45 absolute" />
                                <div className="w-full h-px bg-red-500 -rotate-45 absolute" />
                              </div>
                            )}
                            {time}
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-4 mt-8">
                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 bg-gray-100 text-gray-600 py-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Atrás
                  </button>
                  <button 
                    type="button"
                    disabled={!formData.date || !formData.time}
                    onClick={() => setStep(3)}
                    className="w-2/3 bg-[var(--color-foreground)] text-white py-4 rounded-xl disabled:opacity-50 hover:bg-gray-800 transition-colors shadow-md flex justify-center items-center gap-2 font-medium"
                  >
                    Continuar <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-xl font-medium mb-6 text-center text-gray-800">Tus datos</h3>
                
                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-sm text-gray-500 mb-2 font-medium">Nombre completo</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="text" 
                        required
                        placeholder="Ej. María Gómez"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-pink-100 transition-all text-gray-800"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-500 mb-2 font-medium">Número de WhatsApp</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input 
                        type="tel" 
                        required
                        placeholder="Ej. 362 4123456"
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[var(--color-secondary)] focus:ring-2 focus:ring-pink-100 transition-all text-gray-800"
                        value={formData.phone}
                        onChange={e => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Resumen */}
                <div className="bg-[var(--color-background)] p-6 rounded-2xl mb-8 border border-pink-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-pink-100 rounded-bl-[100%] opacity-50 pointer-events-none" />
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-[var(--color-secondary)]" /> Resumen de tu turno
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700 flex justify-between"><span className="text-gray-500">Servicio:</span> <span className="font-medium">{formData.service}</span></p>
                    <p className="text-gray-700 flex justify-between"><span className="text-gray-500">Fecha:</span> <span className="font-medium capitalize">{formData.date && format(new Date(formData.date+"T00:00:00"), "EEEE d 'de' MMMM", {locale:es})}</span></p>
                    <p className="text-gray-700 flex justify-between"><span className="text-gray-500">Hora:</span> <span className="font-medium">{formData.time} hs</span></p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-1/3 bg-gray-100 text-gray-600 py-4 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  >
                    Atrás
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.phone}
                    className="w-2/3 bg-[var(--color-secondary)] text-white py-4 rounded-xl disabled:opacity-50 hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg shadow-pink-200 font-medium"
                  >
                    {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
