import React from 'react';
import {View, StyleSheet} from 'react-native';
import CustomButton from './common/CustomButton';
import CustomText from './common/CustomText';
import CustomImage from './common/CustomImage';
import FavoriteButton from './FavoriteButton';


const HorizontalItemCard = ({
  item,
  theme,
  navigation,
  showFavorite,
}) => {
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemInfoContainer}>
        <CustomButton
          style={styles.imageContainer}
          onPress={() => navigation.navigate('ItemDetails', {itemId: item.id})}>
          <CustomImage
            source={item.images?.[0]}
            style={styles.itemImage}
            overlay
          />
        </CustomButton>
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
      {showFavorite && (
        <View style={styles.heartIcon}>
          <FavoriteButton 
            item={item} 
            size={22} 
            style={{padding: 0}} 
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemCard: {
    paddingHorizontal: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    overflow: 'hidden',
    borderRadius: 12,
  },
  itemInfoContainer: {
    flexDirection: 'row',
    gap: 10,

  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 20,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemContent: {
    paddingTop: 5,
  },
  heartIcon: {
    padding: 5,
  },
});

export default HorizontalItemCard;
