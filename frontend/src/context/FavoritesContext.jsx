import { createContext, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState(() => {
        try {
            const localFavorites = localStorage.getItem('favorites');
            return localFavorites ? JSON.parse(localFavorites) : [];
        } catch (error) {
            console.error("Failed to parse favorites from localStorage", error);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('favorites', JSON.stringify(favorites));
        } catch (error) {
            console.error("Failed to save favorites to localStorage", error);
        }
    }, [favorites]);

    const addToFavorites = (product) => {
        if (!isFavorite(product._id)) {
            setFavorites((prevFavorites) => [...prevFavorites, { ...product }]);
            message.success(`${product.name} favorilere eklendi!`);
        } else {
            // İsteğe bağlı: zaten favorilerde olduğuna dair bir mesaj gösterilebilir
            // message.info(`${product.name} zaten favorilerinizde.`);
        }
    };

    const removeFromFavorites = (productId) => {
        setFavorites((prevFavorites) => prevFavorites.filter((item) => item._id !== productId));
        message.warning(`Ürün favorilerden kaldırıldı.`);
    };

    const clearFavorites = () => {
        if (favorites.length > 0) {
            setFavorites([]);
            message.info("Tüm favoriler temizlendi.");
        }
    };

    const isFavorite = (productId) => {
        return favorites.some((item) => item._id === productId);
    };

    const toggleFavorite = (product) => {
        if (isFavorite(product._id)) {
            removeFromFavorites(product._id);
        } else {
            addToFavorites(product);
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, toggleFavorite, clearFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

FavoritesProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}; 