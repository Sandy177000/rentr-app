import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import CustomText from './CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { userApi } from '../apis/user';
const {width} = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; // 48 = padding left + right + gap
const ListItem = ({item, index, theme, navigation}) => {
  const [isFavourite, setIsFavourite] = useState(item.isFavorite);
  const handleFavourite = async () => {
    if(isFavourite) {
      await userApi.removeFromFavourites(item.id);
    } else {
      await userApi.addToFavourites(item.id);
    }
    setIsFavourite(!isFavourite);
  };
  return (
    <View
      style={[
        styles.itemCard,
        {
          backgroundColor: theme.colors.surface,
          marginLeft: index % 2 === 0 ? 0 : 8,
          shadowColor: theme.colors.text.primary,
        },
      ]}>
      {/* add heart icon to top right */}
      <TouchableOpacity style={styles.heartIcon} onPress={handleFavourite}>
        <Icon name="heart" size={24} color={isFavourite ? theme.colors.primary : theme.colors.secondary} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('ItemDetails', {item})}>
        <Image
          source={{uri: item.images?.[0] || 'https://via.placeholder.com/150'}}
          style={styles.itemImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.itemContent}>
        <CustomText
          style={[styles.itemTitle, {color: theme.colors.text.primary}]}
          numberOfLines={1}>
          {item.name}
        </CustomText>
        <CustomText
          style={[styles.itemPrice, {color: theme.colors.text.secondary}]}>
          ${item.price}/day
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100, // Space for the add button
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  itemCard: {
    position: 'relative',
    width: COLUMN_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  itemContent: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    marginBottom: 12,
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default ListItem;
