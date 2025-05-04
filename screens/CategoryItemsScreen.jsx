import React, {useCallback, useEffect, useState} from 'react';
import {itemApi} from '../src/services/api/index';
import {useTheme} from '../src/theme/ThemeProvider';
import {useNavigation} from '@react-navigation/native';
import TwoColumnListView from '../src/components/TwoColumnListView';
import ScreenHeader from '../src/components/ScreenHeader';
import { View } from 'react-native';
const CategoryItemsScreen = ({route}) => {
  const {category} = route.params;
  const theme = useTheme();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const fetchCategoryItems = useCallback(async () => {
    try {
      setLoading(true);
      const res = await itemApi.getCategoryItems(category);
      setItems(res);
    } catch (error) {
      console.error('Error fetching category items:', error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchCategoryItems();
  }, [fetchCategoryItems]);

  return (
    <View style={{flex: 1, backgroundColor: theme.colors.background}}>
      <ScreenHeader title={category} />
      <TwoColumnListView
        loading={loading}
        items={items}
        theme={theme}
        navigation={navigation}
        emptyText="No items for this category"
      />
    </View>
  );
};

export default CategoryItemsScreen;
