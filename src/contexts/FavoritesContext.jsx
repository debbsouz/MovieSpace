import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const FavoritesContext = createContext(null);

const STORAGE_KEY = 'favorites';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Erro ao ler favorites do localStorage:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Erro ao salvar favorites no localStorage:', e);
    }
  }, [favorites]);

  // ✅ Aqui está a correção principal: comparar pelo id (e blindar string/number)
  const isFavorite = (id) => favorites.some((fav) => String(fav.id) === String(id));

  const addFavorite = (item) => {
    if (!item?.id) return;
    setFavorites((prev) => {
      if (prev.some((fav) => String(fav.id) === String(item.id))) return prev;
      return [item, ...prev];
    });
  };

  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((fav) => String(fav.id) !== String(id)));
  };

  const clearFavorites = () => setFavorites([]);

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
  if (!ctx) throw new Error('useFavorites must be used within a FavoritesProvider');
  return ctx;
}