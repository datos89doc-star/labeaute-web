"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Phone, Camera, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

// Estas rutas apuntarán a las fotos que descargaste.
const CAROUSEL_IMAGES = [
  "/foto1.jpg",
  "/foto2.jpg",
  "/foto3.jpg",
];

const SERVICES = [
  {
    title: "Masaje Descontracturante",
    desc: "Técnicas especializadas de presión para aliviar la tensión muscular, mejorar la circulación y promover el bienestar general.",
  },
  {
    title: "Masajes Relajantes",
    desc: "Movimientos suaves y rítmicos enfocados en relajar los músculos, calmar la mente y generar un estado de profunda tranquilidad.",
  },
  {
    title: "Combo Facial Premium",
    desc: "Limpieza facial, mascarilla hidratante y tecnología LED para dejar tu piel radiante, firme y rejuvenecida.",
  },
  {
    title: "Hidralips",
    desc: "Tratamiento de hidratación profunda para labios. Aporta color, brillo y suavidad extrema para un rostro siempre iluminado.",
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide del carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      
      {/* Hero Section con Carrusel de fondo */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
        {/* Carousel Background */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={CAROUSEL_IMAGES[currentSlide]}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.4, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80";
            }}
          />
        </AnimatePresence>
        
        {/* Overlay oscuro/rosado para fondo */}
        <div className="absolute inset-0 bg-gradient-to-b from-pink-50/80 to-pink-100/95" />

        {/* Flechas del carrusel */}
        <div className="absolute inset-0 flex justify-between items-center px-4 md:px-12 z-20 pointer-events-none">
           <button onClick={prevSlide} className="pointer-events-auto bg-white/30 hover:bg-white/50 p-3 rounded-full backdrop-blur-sm transition-all text-gray-800">
             <ChevronLeft size={32} />
           </button>
           <button onClick={nextSlide} className="pointer-events-auto bg-white/30 hover:bg-white/50 p-3 rounded-full backdrop-blur-sm transition-all text-gray-800">
             <ChevronRight size={32} />
           </button>
        </div>

        <div className="relative z-20 text-center px-4 w-full max-w-4xl mx-auto flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="flex flex-col items-center w-full"
          >
            {/* Video Central */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="mb-10 w-full max-w-md mx-auto rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-[0_20px_50px_-15px_rgba(183,110,121,0.5)] relative bg-black/5"
            >
              <video 
                src="/video_portada.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-[60vh] md:h-[600px] object-cover"
              >
                 Tu navegador no soporta videos.
              </video>
            </motion.div>

            <Link 
              href="/reservar" 
              className="inline-block bg-[var(--color-secondary)] text-white px-12 py-4 rounded-full text-xl tracking-widest hover:bg-[var(--color-primary-dark)] transition-all duration-300 shadow-[0_10px_30px_-5px_rgba(183,110,121,0.6)] hover:shadow-xl hover:-translate-y-1 uppercase font-medium"
            >
              AGENDAR TURNO
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Servicios Principales */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-[var(--color-primary)] font-medium tracking-widest uppercase text-sm">Nuestros</span>
            <h2 className="text-4xl md:text-5xl font-serif text-[var(--color-foreground)] mt-2 mb-6">Tratamientos Exclusivos</h2>
            <div className="w-24 h-1 bg-[var(--color-primary-light)] mx-auto rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SERVICES.map((srv, idx) => (
              <motion.div 
                key={srv.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[var(--color-background)] border border-pink-50 p-10 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-100/50 to-transparent rounded-bl-[5rem] -z-10 transition-transform group-hover:scale-150 duration-700" />
                <h3 className="text-2xl font-serif text-[var(--color-foreground)] mb-4">{srv.title}</h3>
                <p className="text-gray-600 font-light leading-relaxed mb-8">
                  {srv.desc}
                </p>
                <Link 
                  href="/reservar" 
                  className="text-[var(--color-secondary)] font-medium uppercase tracking-wider text-sm hover:text-[var(--color-primary-dark)] flex items-center gap-2 transition-colors"
                >
                  <Calendar size={16} /> Reservar este servicio
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Info y Contacto */}
      <section className="py-24 bg-pink-50/50 px-4 border-t border-pink-100/50">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-foreground)] mb-6">Estaremos encantados de recibirte</h2>
            <p className="text-gray-600 mb-8 font-light leading-relaxed">
              En La Beauté nos dedicamos a brindarte una experiencia única y reparadora. Utilizamos tecnología de vanguardia y productos premium para realzar tu belleza natural.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-600">
                <Clock className="text-[var(--color-secondary)]" size={24} />
                <span className="font-light">Lunes a Viernes: 9-13hs y 17-21hs<br/>Sábados: 9-13hs</span>
              </div>
              <div className="flex items-center gap-4 text-gray-600">
                <MapPin className="text-[var(--color-secondary)]" size={24} />
                <span className="font-light">Mitre y Av. Lavalle Local N°19</span>
              </div>
              <a href="https://wa.me/5493624080375" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-gray-600 hover:text-[var(--color-primary)] transition-colors">
                <Phone className="text-[var(--color-secondary)]" size={24} />
                <span className="font-light">+54 9 362 408-0375</span>
              </a>
              <a href="https://www.instagram.com/estetica.labeaute" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-gray-600 hover:text-[var(--color-primary)] transition-colors">
                <Camera className="text-[var(--color-secondary)]" size={24} />
                <span className="font-light">@estetica.labeaute</span>
              </a>
            </div>
          </div>
          
          <div className="h-96 rounded-3xl overflow-hidden shadow-xl border-4 border-white relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3540.812328606471!2d-58.9818!3d-27.4429!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDI2JzM0LjQiUyA1OMKwNTgnNTQuNSJX!5e0!3m2!1ses!2sar!4v1620000000000!5m2!1ses!2sar" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Call to action de Reseñas */}
      <section className="py-24 bg-white px-4 text-center">
         <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-foreground)] mb-6">Tu opinión es importante</h2>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto font-light">
              Si ya nos visitaste, nos encantaría saber cómo fue tu experiencia. Tus comentarios nos ayudan a seguir brindando un servicio de excelencia.
            </p>
            <Link href="/resenas" className="inline-block px-10 py-4 border-2 border-[var(--color-secondary)] text-[var(--color-secondary)] rounded-full hover:bg-[var(--color-secondary)] hover:text-white transition-all font-medium tracking-wide">
               DEJAR UNA RESEÑA
            </Link>
         </div>
      </section>
    </div>
  );
}
