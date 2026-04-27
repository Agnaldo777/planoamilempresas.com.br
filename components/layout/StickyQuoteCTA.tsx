'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, MessageCircle } from 'lucide-react';

export function StickyQuoteCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (dismissed || !visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/5511942007866?text=Olá! Gostaria de uma cotação empresarial Amil."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chamar no WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform hover:scale-110"
      >
        <MessageCircle className="h-7 w-7" />
      </a>

      {/* Sticky CTA card */}
      <div className="relative w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="text-sm font-bold text-gray-900">Cotação em 2 minutos</p>
        <p className="mt-1 text-xs text-gray-500">
          Formulário simples, 4 campos. Proposta no WhatsApp.
        </p>
        <Link
          href="/cotacao-online"
          className="mt-3 block rounded-lg bg-cta-green px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-cta-green-hover"
        >
          Simular agora →
        </Link>
      </div>
    </div>
  );
}
