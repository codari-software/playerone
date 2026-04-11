"use client";

import { useState } from 'react';
import { RetroButton } from './RetroButton';

interface StripeCheckoutButtonProps {
  planId: string;
  active?: boolean;
  children: React.ReactNode;
}

export function StripeCheckoutButton({ planId, active, children }: StripeCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Erro no checkout", data);
        alert("Erro no servidor. Stripe Checkout falhou.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RetroButton active={active} onClick={handleCheckout}>
      {loading ? 'CARREGANDO...' : children}
    </RetroButton>
  );
}
