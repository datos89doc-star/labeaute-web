"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Star, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ResenasPage() {
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comment })
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Hubo un error al enviar tu reseña.");
      }
    } catch (error) {
      alert("Hubo un error al enviar tu reseña.");
    } finally {
      setIsSubmitting(false);
    }
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
          <h2 className="text-3xl font-serif text-[var(--color-foreground)] mb-4">¡Gracias por tu reseña!</h2>
          <p className="text-gray-600 mb-8 font-light">
            Tus comentarios nos ayudan a seguir mejorando para brindarte la mejor experiencia.
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
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[var(--color-secondary)] mb-8 transition-colors">
          <ArrowLeft size={20} /> Volver
        </Link>
        
        <div className="bg-white rounded-3xl shadow-lg p-6 md:p-12 border border-pink-50">
          <h1 className="text-3xl md:text-4xl font-serif text-[var(--color-foreground)] mb-2 text-center">Déjanos tu opinión</h1>
          <p className="text-center text-gray-500 font-light mb-8">Cuéntanos cómo fue tu experiencia en La Beauté</p>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-8 text-center">
              <label className="block text-sm text-gray-500 mb-4">Tu calificación</label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star 
                      size={40} 
                      fill={(hoveredRating || rating) >= star ? "#fbbf24" : "transparent"} 
                      className={`${(hoveredRating || rating) >= star ? "text-yellow-400" : "text-gray-300"} transition-colors`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm text-gray-500 mb-2">Comentario breve</label>
              <textarea 
                required
                rows={4}
                placeholder="Me encantó el servicio de..."
                className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-[var(--color-secondary)] transition-colors resize-none"
                value={comment}
                onChange={e => setComment(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || !comment}
              className="w-full bg-[var(--color-secondary)] text-white py-4 rounded-xl disabled:opacity-50 hover:bg-[var(--color-primary-dark)] transition-colors shadow-lg shadow-pink-200"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Reseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
