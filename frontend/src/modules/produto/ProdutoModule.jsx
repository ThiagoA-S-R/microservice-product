// src/modules/produto/ProdutoModule.jsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../../components/ui/Pagination';

function ProdutoModule() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get('page') ?? 1);
  const limitParam = Number(searchParams.get('limit') ?? 10);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: pageParam, totalPages: 1, totalItems: 0, itemsPerPage: limitParam });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function updateParams(newPage, newLimit) {
    const params = {};
    params.page = String(newPage);
    params.limit = String(newLimit);
    setSearchParams(params);
  }

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(`/products?page=${pageParam}&limit=${limitParam}`, { signal: controller.signal });
        if (res.status === 400) {
          const body = await res.json();
          setError(body.error || 'Parâmetros inválidos');
          setProducts([]);
          setLoading(false);
          return;
        }
        if (!res.ok) throw new Error('network');
        const payload = await res.json();
        const data = payload.data ?? payload;
        const pag = payload.pagination ?? { currentPage: pageParam, totalPages: 1, totalItems: data.length, itemsPerPage: limitParam };
        if (!isMounted) return;
        setProducts(data);
        setPagination(pag);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (e) {
        if (e.name === 'AbortError') return;
        setError('Não foi possível carregar os produtos. Tente novamente mais tarde.');
        setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => { isMounted = false; controller.abort(); }
  }, [pageParam, limitParam]);

  function handlePageChange(p) {
    updateParams(p, pagination.itemsPerPage);
  }

  function handleItemsPerPageChange(n) {
    updateParams(1, n);
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Produtos</h2>
      {loading && <div>Carregando...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descrição</th>
                  <th>Preço</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.idProduct}>
                    <td>{p.idProduct}</td>
                    <td>{p.description}</td>
                    <td>{p.price ? Number(p.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <div className="mb-2 text-sm">Mostrando página {pagination.currentPage} de {pagination.totalPages} — Total: {pagination.totalItems}</div>
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={pagination.itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default ProdutoModule;
