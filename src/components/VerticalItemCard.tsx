import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import CustomText from './common/CustomText';
import CustomImage from './common/CustomImage';
import FavoriteButton from './FavoriteButton';
import { TListItemProps } from './types';
import { placeholderImage } from '../constants';


const {width} = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

  const VerticalItemCard = ({item, theme, navigation, showFavorite}: TListItemProps) => {
  return (
    <>
      <View style={styles.itemCard}>
        {showFavorite && (
          <View style={styles.heartIcon}>
            <FavoriteButton item={item} size={22} style={{padding: 0}} />
          </View>
        )}
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => navigation.navigate('ItemDetails', {itemId: item.id, showFavorite})}>
          <CustomImage
            source={item.images?.[0].uri}
            style={styles.itemImage}
            overlay
            placeholder={placeholderImage}
          />
        </TouchableOpacity>
        <View style={[styles.itemContent, {backgroundColor: theme.colors.surface}]}>
          <CustomText
            bold={600}
            variant="h4"
            style={{color: theme.colors.text.primary}}
            props={{numberOfLines: 1}}
          >
            {item.name}
          </CustomText>
          <CustomText
            bold={900}
            variant="h4"
            style={{color: theme.colors.text.secondary}}
            props={{numberOfLines: 1}}
          >
            Rs. {item.price} / DAY
          </CustomText>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  heartIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 1000,
  },
  itemCard: {
    width: COLUMN_WIDTH,
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemContent: {
    paddingTop: 15,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    height: '45%',
    gap: 5,
  },
  itemPrice: {
    marginBottom: 12,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: 16,
  },
});

export default VerticalItemCard;
