import { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Context da "Minha Lista" (favoritos). Aqui fica toda a lógica de salvar/remover
// e persistir no localStorage sem eu precisar repetir isso em todo componente.
const FavoritesContext = createContext(null);

// chave padrão no localStorage (pra ficar fácil de achar e limpar se precisar)
const STORAGE_KEY = 'favorites';

export function FavoritesProvider({ children }) {
  // Inicializo já lendo do localStorage (assim a lista não some ao dar refresh)
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Erro ao ler favorites do localStorage:', e);
      return [];
    }
  });

  // Sempre que favorites mudar, eu salvo de volta no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Erro ao salvar favorites no localStorage:', e);
    }
  }, [favorites]);

  // Verifica se já está favoritado.
  // Eu comparo como string pra evitar bug chato (às vezes vem number, às vezes string).
  const isFavorite = (id) => favorites.some((fav) => String(fav.id) === String(id));

  // Adiciona no topo da lista (pra ficar tipo "adicionei agora", já aparece primeiro)
  // E também evita duplicar o mesmo item.
  const addFavorite = (item) => {
    if (!item?.id) return;

    setFavorites((prev) => {
      const exists = prev.some((fav) => String(fav.id) === String(item.id));
      if (exists) return prev;
      return [item, ...prev];
    });
  };

  // Remove pelo id
  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((fav) => String(fav.id) !== String(id)));
  };

  // Limpa geral (útil pra botão "Limpar lista")
  const clearFavorites = () => setFavorites([]);

  // useMemo aqui é só pra não recriar o objeto do context toda hora sem necessidade,
  // aí evita re-render chato em componentes que consomem o contexto.
  const value = useMemo(
    () => ({
      favorites,
      isFavorite,
      addFavorite,
      removeFavorite,
      clearFavorites,
    }),
    [favorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);

  // Se eu esquecer de envolver o app com FavoritesProvider, já dá erro claro
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');

  return ctx;
}