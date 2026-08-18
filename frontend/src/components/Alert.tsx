import type { ReactNode } from 'react';

type Variante = 'info' | 'error' | 'success';

const estilos: Record<Variante, string> = {
  info: 'bg-blue-50 text-blue-800 border-blue-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

export default function Alert({ tipo = 'info', children }: { tipo?: Variante; children: ReactNode }) {
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm ${estilos[tipo]}`}>{children}</div>
  );
}
