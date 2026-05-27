"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Star, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const WhatsappIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.584.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

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
  const [reviews, setReviews] = useState<any[]>([]);

  // Auto-slide del carrusel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Fetch reviews
  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setReviews(data);
        }
      })
      .catch(err => console.error(err));
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
              className="mb-10 w-full max-w-sm md:max-w-lg lg:max-w-xl mx-auto rounded-[2.5rem] overflow-hidden border-[6px] border-white shadow-[0_20px_50px_-15px_rgba(183,110,121,0.5)] relative bg-black/5"
            >
              <video 
                src="/video_portada.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-[65vh] md:h-[75vh] lg:h-[80vh] object-cover"
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
              En La Beauté creemos que el bienestar y la belleza van de la mano. Te ofrecemos una experiencia única de relajación y cuidado personal, combinando tecnología, productos de alta calidad y atención profesional para realzar tu belleza natural y ayudarte a sentirte renovada en cada visita.
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
              <a href="https://wa.me/5493624080375" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-gray-600 hover:text-[#25D366] transition-colors">
                <WhatsappIcon className="w-6 h-6 text-[#25D366]" />
                <span className="font-light">+54 9 362 408-0375</span>
              </a>
              <a href="https://www.instagram.com/estetica.labeaute" target="_blank" rel="noreferrer" className="flex items-center gap-4 text-gray-600 hover:text-[#E1306C] transition-colors">
                <InstagramIcon className="w-6 h-6 text-[#E1306C]" />
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

      {/* Mostrar Reseñas Reales */}
      {reviews.length > 0 && (
        <section className="py-24 bg-[var(--color-background)] px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--color-foreground)] mb-12 text-center">Lo que dicen de nosotros</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((review: any) => (
                <div key={review.id} className="bg-white p-8 rounded-[2rem] shadow-sm border border-pink-50 hover:shadow-md transition-shadow">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill={i < review.rating ? "#fbbf24" : "transparent"} className={i < review.rating ? "text-yellow-400" : "text-gray-200"} />
                    ))}
                  </div>
                  <p className="text-gray-600 font-light italic mb-4">"{review.comment}"</p>
                  <p className="text-sm text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString('es-AR')}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* Footer y Acceso a Panel Admin */}
      <footer className="bg-pink-50 py-8 text-center border-t border-pink-100 relative">
         <p className="text-gray-400 text-sm mb-4">© 2026 Estética La Beauté. Todos los derechos reservados.</p>
         <Link href="/admin" className="text-gray-300 hover:text-gray-500 text-xs transition-colors">
            Acceso Profesional (Admin)
         </Link>
      </footer>

      {/* Botón Flotante de WhatsApp Animado */}
      <a 
        href="https://wa.me/5493624080375" 
        target="_blank" 
        rel="noreferrer" 
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#20b858] transition-colors flex items-center justify-center animate-bounce shadow-[#25D366]/40"
      >
        <WhatsappIcon className="w-8 h-8" />
      </a>
    </div>
  );
}
