import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { itemApi } from './../src/apis/item';
import { userApi } from './../src/apis/user';
import _ from 'lodash';

const initialState = {
  items: [],
  favourites: [],
  loading: false,
  error: null,
};


// all items except user's items
export const getItems = createAsyncThunk('items/getItems', async (_, { rejectWithValue }) => {
  try {
    const response = await itemApi.getItems();
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// user's favourite items
export const getFavouriteItems = createAsyncThunk('items/getFavouriteItems', async (_, { rejectWithValue }) => {
  try {
    const response = await userApi.getFavourites();
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// add item to favourites
export const addToFavourites = createAsyncThunk('items/addToFavourites', async (itemId, { rejectWithValue }) => {
  try {
    const response = await userApi.addToFavourites(itemId);
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// remove item from favourites
export const removeFromFavourites = createAsyncThunk('items/removeFromFavourites', async (itemId, { rejectWithValue }) => {
  try {
    const response = await userApi.removeFromFavourites(itemId);
    return response;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


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
       let payloadItem = action.payload;
       _.set(payloadItem, 'isFavorite', true);
       let newFavourites = _.uniqBy([...state.favourites, payloadItem], 'id');
       state.favourites = newFavourites;
    },
    removeFavourite: (state, action) => {
      let payloadItem = action.payload;
      _.set(payloadItem, 'isFavorite', false);
      let newFavourites = _.uniqBy(state.favourites.filter(item => item.id !== payloadItem.id), 'id');
      state.favourites = newFavourites;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getItems.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getItems.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(getItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });

    // get favourite items
    builder.addCase(getFavouriteItems.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getFavouriteItems.fulfilled, (state, action) => {
      state.favourites = action.payload;
      state.loading = false;
    });
    builder.addCase(getFavouriteItems.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });

    // add item to favourites
    builder.addCase(addToFavourites.pending, (state) => {
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
    builder.addCase(removeFromFavourites.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeFromFavourites.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(removeFromFavourites.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error;
    });
  },
});

export const { setItems, setFavourites, addFavourite, removeFavourite } = itemsSlice.actions;

export const selectItems = (state) => state.items.items;
export const selectFavourites = (state) => state.items.favourites;
export const selectLoading = (state) => state.items.loading;
export const selectError = (state) => state.items.error;

export default itemsSlice.reducer;