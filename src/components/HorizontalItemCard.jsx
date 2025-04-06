import React from 'react';
import {View, StyleSheet} from 'react-native';
import CustomButton from './common/CustomButton';
import CustomText from './common/CustomText';
import CustomImage from './common/CustomImage';
import Icon from 'react-native-vector-icons/FontAwesome';
import globalStyles from '../theme/global.styles';

const HorizontalItemCard = ({
  item,
  theme,
  navigation,
  isFavourite,
  handleFavourite,
  showFavorite,
}) => {
  return (
    <View style={styles.itemCard}>
      <View style={styles.itemInfoContainer}>
        <CustomButton
          style={styles.imageContainer}
          onPress={() => navigation.navigate('ItemDetails', {item, isFavourite, showFavorite})}>
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
        <CustomButton style={styles.heartIcon} onPress={handleFavourite}>
          {isFavourite ? (
            <Icon name="heart" size={22} color={theme.colors.primary} />
          ) : (
          <Icon name="heart-o" size={22} color={'#FFFFFF'} />
          )}
        </CustomButton>
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
    overflow: 'hidden',

  },
  itemImage: {
    width: '100%',
    height: '100%',
    ...globalStyles.borderRadius,
  },
  itemContent: {
    paddingTop: 5,
  },
  heartIcon: {
    padding: 5,
  },
});

export default HorizontalItemCard;
