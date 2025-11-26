// src/components/ui/Pagination.jsx
import React from 'react';

function buildPages(totalPages, currentPage) {
  const pages = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }
  pages.push(1);
  let left = Math.max(2, currentPage - 1);
  let right = Math.min(totalPages - 1, currentPage + 1);
  if (left > 2) pages.push('left-ellipsis');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push('right-ellipsis');
  pages.push(totalPages);
  return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange, itemsPerPage, onItemsPerPageChange }) {
  const pages = buildPages(totalPages, currentPage);
  return (
    <nav aria-label="Navegação de páginas" className="flex items-center gap-2">
      <button aria-label="Página anterior" disabled={currentPage===1} onClick={() => onPageChange(currentPage-1)} className="px-2 py-1 border rounded disabled:opacity-50">Anterior</button>
      {pages.map((p, idx) => {
        if (p === 'left-ellipsis' || p === 'right-ellipsis') return <span key={idx} className="px-2">…</span>;
        return (
          <button
            key={idx}
            aria-current={p===currentPage ? 'page' : undefined}
            onClick={() => onPageChange(p)}
            className={`px-2 py-1 border rounded ${p===currentPage ? 'font-bold bg-gray-200' : ''}`}
          >
            {p}
          </button>
        );
      })}
      <button aria-label="Próxima página" disabled={currentPage===totalPages} onClick={() => onPageChange(currentPage+1)} className="px-2 py-1 border rounded disabled:opacity-50">Próxima</button>

      <label className="ml-4 flex items-center gap-2">
        <span>Itens por página</span>
        <select value={itemsPerPage} onChange={(e) => onItemsPerPageChange(Number(e.target.value))} aria-label="Itens por página" className="border rounded px-2 py-1">
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </label>
    </nav>
  );
}
