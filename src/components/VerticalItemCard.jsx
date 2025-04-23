import React from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import CustomText from './common/CustomText';
import CustomImage from './common/CustomImage';
import FavoriteButton from './FavoriteButton';
const {width} = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const VerticalItemCard = ({
  item,
  theme,
  navigation,
  showFavorite,
}) => {
  return (
    <>
      <View style={styles.itemCard}>
        {showFavorite && (
          <View style={styles.heartIcon}>
            <FavoriteButton 
              item={item} 
              size={22} 
              style={{padding: 0}} 
            />
          </View>
        )}
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => navigation.navigate('ItemDetails', {itemId: item.id})}>
          <CustomImage
            source={item.images?.[0]}
            style={styles.itemImage}
            overlay
          />
        </TouchableOpacity>
        <View style={styles.itemContent}>
        <CustomText
          bold={600}
          variant="h4"
          style={{color: theme.colors.text.primary}}
          numberOfLines={1}>
          {item.name}
        </CustomText>
        <CustomText
          bold={600}
          variant="h4"
          style={{color: theme.colors.text.secondary}}>
          Rs. {item.price}/day
        </CustomText>
      </View>
      </View>
      
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
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
    width: COLUMN_WIDTH,
    borderRadius: 12,
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
    paddingTop: 10,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingBottom: 30,
    paddingHorizontal: 10,

  },
  itemPrice: {
    marginBottom: 12,
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
    marginTop: 16,
  },
});

export default VerticalItemCard;
