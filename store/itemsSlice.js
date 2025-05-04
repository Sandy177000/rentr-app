import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {itemApi} from '../src/services/api/index';
import {userApi} from '../src/services/api/index';
import _ from 'lodash';
import { createSelector } from 'reselect';

const initialState = {
  items: [],
  nearbyItems: [],
  userItems: [],
  favourites: [],
  loading: false,
  error: null,
};

// all items except user's items
export const getItems = createAsyncThunk(
  'items/getItems',
  async (_, {rejectWithValue}) => {
    try {
      const response = await itemApi.getItems();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// nearby items
export const getNearbyItems = createAsyncThunk(
  'items/getNearbyItems',
  async (data, {rejectWithValue}) => {
    try {
      const response = await itemApi.getNearbyItems(data);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// user's favourite items
export const getFavouriteItems = createAsyncThunk(
  'items/getFavouriteItems',
  async (_, {rejectWithValue}) => {
    try {
      const response = await userApi.getFavourites();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// New thunk to handle toggling favorites with proper state updates
export const toggleFavoriteStatus = createAsyncThunk(
  'items/toggleFavoriteStatus',
  async ({item, isFavorite}, {dispatch, rejectWithValue}) => {
    try {
      // Optimistic UI update first
      if (isFavorite) {
        dispatch(removeFavourite(item));
      } else {
        dispatch(addFavourite(item));
      }

      // Then API call
      if (isFavorite) {
        await userApi.removeFromFavourites(item.id);
      } else {
        await userApi.addToFavourites(item.id);
      }

      return {success: true};
    } catch (error) {
      // If API fails, revert the UI update
      if (isFavorite) {
        dispatch(addFavourite(item));
      } else {
        dispatch(removeFavourite(item));
      }
      return rejectWithValue(error.message);
    }
  },
);

// add item to favourites
export const addToFavourites = createAsyncThunk(
  'items/addToFavourites',
  async (itemId, {rejectWithValue}) => {
    try {
      const response = await userApi.addToFavourites(itemId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// remove item from favourites
export const removeFromFavourites = createAsyncThunk(
  'items/removeFromFavourites',
  async (itemId, {rejectWithValue}) => {
    try {
      const response = await userApi.removeFromFavourites(itemId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// user's items
export const getUserItems = createAsyncThunk(
  'items/getUserItems',
  async (_, {rejectWithValue}) => {
    try {
      const response = await itemApi.getUserItems();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    setFavourites: (state, action) => {
      state.favourites = action.payload;
    },
    addFavourite: (state, action) => {
      let payloadItem = {...action.payload};
      _.set(payloadItem, 'isFavorite', true);
      let newFavourites = _.uniqBy([...state.favourites, payloadItem], 'id');
      state.favourites = newFavourites;
      // update the items
      let newItems = state.items.map(item => {
        if (item.id === payloadItem.id) {
          return {...item, isFavorite: true};
        }
        return item;
      });

      state.items = newItems;
    },
    removeFavourite: (state, action) => {
      let payloadItem = {...action.payload};
      _.set(payloadItem, 'isFavorite', false);
      let newFavourites = _.uniqBy(
        state.favourites.filter(item => item.id !== payloadItem.id),
        'id',
      );
      state.favourites = newFavourites;
      // update the items
      let newItems = state.items.map(item => {
        if (item.id === payloadItem.id) {
          return {...item, isFavorite: false};
        }
        return item;
      });
      state.items = newItems;
    },
    resetItems: state => {
      state = initialState;
    },
  },
  extraReducers: builder => {
    builder.addCase(getItems.pending, state => {
      state.loading = true;
    });
    builder.addCase(getItems.fulfilled, (state, action) => {
      // When loading items, mark which ones are favorites
      const favoriteIds = state.favourites.map(item => item.id);
      const itemsWithFavoriteStatus = action.payload.map(item => ({
        ...item,
        isFavorite: favoriteIds.includes(item.id),
      }));

      state.items = itemsWithFavoriteStatus;
      state.loading = false;
    });
    builder.addCase(getItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });

    // get favourite items
    builder.addCase(getFavouriteItems.pending, state => {
      state.loading = true;
    });
    builder.addCase(getFavouriteItems.fulfilled, (state, action) => {
      // Mark all favorites with isFavorite: true
      const favoriteItems = action.payload?.map(item => ({
        ...item,
        isFavorite: true,
      }));

      state.favourites = favoriteItems;

      // Also synchronize with items array
      const favoriteIds = favoriteItems.map(item => item.id);
      state.items = state.items.map(item => {
        if (favoriteIds.includes(item.id)) {
          return {...item, isFavorite: true};
        }
        return item;
      });

      state.loading = false;
    });
    builder.addCase(getFavouriteItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });

    // add item to favourites
    builder.addCase(addToFavourites.pending, state => {
      state.loading = true;
    });
    builder.addCase(addToFavourites.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(addToFavourites.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });

    // remove item from favourites
    builder.addCase(removeFromFavourites.pending, state => {
      state.loading = true;
    });
    builder.addCase(removeFromFavourites.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(removeFromFavourites.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });

    // user's items
    builder.addCase(getUserItems.pending, state => {
      state.loading = true;
    });
    builder.addCase(getUserItems.fulfilled, (state, action) => {
      state.userItems = action.payload;
    });

    // nearby items
    builder.addCase(getNearbyItems.pending, state => {
      state.loading = true;
    });
    builder.addCase(getNearbyItems.fulfilled, (state, action) => {
      state.nearbyItems = action.payload;
      state.loading = false;
    });
    builder.addCase(getNearbyItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  },
});

export const {
  setItems,
  setFavourites,
  addFavourite,
  removeFavourite,
  resetItems,
} = itemsSlice.actions;

export const selectItems = state => state.items.items;
export const selectNearByItems = state => state.items.nearbyItems;
export const selectUserItems = state => state.items.userItems;
export const selectFavourites = state => state.items.favourites;
export const selectFavouriteIds = createSelector(
  [selectFavourites],
  (favourites) => favourites.map(item => item.id)
);
export const selectLoading = state => state.items.loading;
export const selectError = state => state.items.error;

export default itemsSlice.reducer;
