export interface FavoriteAd {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
  condition: string;
}

export const getFavorites = (): FavoriteAd[] => {
  if (typeof window === 'undefined') return [];
  const favs = localStorage.getItem('vapt_favorites');
  return favs ? JSON.parse(favs) : [];
};

export const isFavorite = (id: string): boolean => {
  const favs = getFavorites();
  return favs.some((fav) => fav.id === id);
};

export const toggleFavorite = (ad: FavoriteAd): boolean => {
  let favs = getFavorites();
  const exists = favs.find((fav) => fav.id === ad.id);

  if (exists) {
    // Se já existe, remove
    favs = favs.filter((fav) => fav.id !== ad.id);
    localStorage.setItem('vapt_favorites', JSON.stringify(favs));
    return false; 
  } else {
    // Se não existe, adiciona
    favs.push(ad);
    localStorage.setItem('vapt_favorites', JSON.stringify(favs));
    return true; 
  }
};