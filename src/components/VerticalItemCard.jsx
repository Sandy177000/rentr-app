import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import CustomButton from './common/CustomButton';
import CustomText from './common/CustomText';
import CustomImage from './common/CustomImage';
import Icon from 'react-native-vector-icons/FontAwesome';
const {width} = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const VerticalItemCard = ({
  item,
  theme,
  navigation,
  isFavourite,
  handleFavourite,
}) => {
  return (
    <>
      <View style={styles.itemCard}>
        <CustomButton style={styles.heartIcon} onPress={handleFavourite}>
          {isFavourite ? (
            <Icon name="heart" size={22} color={theme.colors.primary} />
          ) : (
            <Icon name="heart-o" size={22} color={'#FFFFFF'} />
          )}
        </CustomButton>
        <CustomButton
          style={styles.imageContainer}
          onPress={() => navigation.navigate('ItemDetails', {item})}>
          <CustomImage
            source={item.images?.[0]}
            style={styles.itemImage}
            overlay
          />
        </CustomButton>
      </View>
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
    width: '100%',
    height: 200,
    position: 'relative',
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
