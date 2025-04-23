
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToFavourites, removeFromFavourites } from '../../../store/itemsSlice';

const useFavorite = (item) => {
  
    const [isFavourite, setIsFavourite] = useState(false);
    const dispatch = useDispatch();

    const handleFavourite = async () => {
        setIsFavourite(!isFavourite);
        if (isFavourite) {
            await dispatch(removeFromFavourites(item.id)).unwrap();
        } else {
            await dispatch(addToFavourites(item.id)).unwrap();
        }
    };

    return { isFavourite, handleFavourite };
};

export default useFavorite;