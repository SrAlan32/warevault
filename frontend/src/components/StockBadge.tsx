export default function StockBadge({ stockActual, stockMinimo }: { stockActual: number; stockMinimo: number }) {
  if (stockActual === 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        Sin stock
      </span>
    );
  }
  if (stockActual <= stockMinimo) {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
        Bajo stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
      Disponible
    </span>
  );
}
