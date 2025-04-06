import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet, RefreshControl} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ListItem from '../src/components/ListItem';
import CustomText from '../src/components/common/CustomText';
import { useDispatch, useSelector } from 'react-redux';
import { getFavouriteItems, selectFavourites } from '../store/itemsSlice';
import Animated, { FadeInDown } from 'react-native-reanimated';
import TwoColumnListView from '../src/components/TwoColumnListView';
import globalStyles from '../src/theme/global.styles';

const FavouritesScreen = () => {
  const dispatch = useDispatch();
  const favourites = useSelector(selectFavourites);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();

  const getFavourites = async () => {
    setLoading(true);
    try {
      await dispatch(getFavouriteItems()).unwrap();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const emptyComponent = ()=>{
    return (
    <View style={[styles.emptyContainer, {backgroundColor: 'rgba(128, 128, 128, 0.1)'}]}>
    <Icon
        name="heart-o"
        size={45}
        color={theme.colors.text.secondary}
        style={styles.emptyIcon}
      />
      <CustomText
        variant="h4"
        style={{color: theme.colors.text.secondary}}>
        No favourites yet
      </CustomText>
      <CustomText
        variant="h4"
        style={{color: theme.colors.text.secondary}}>
        Items you love will appear here
      </CustomText>
      </View>
  )
  };

  useEffect(() => {
    getFavourites();
  }, []);


  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <TwoColumnListView
        loading={loading}
        items={favourites}
        theme={theme}
        navigation={navigation}
        onRefresh={getFavourites}
        emptyComponent={emptyComponent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    minHeight: '100%',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    ...globalStyles.borderRadius,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default FavouritesScreen;
