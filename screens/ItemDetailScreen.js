// screens/ItemDetailsScreen.js
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import CustomText from '../src/components/common/CustomText';
import {useSelector, useDispatch} from 'react-redux';
import {selectCurrentToken, selectCurrentUser} from '../store/authSlice';
import Carousel from 'react-native-reanimated-carousel';
import {colors} from '../src/theme/theme';
import CustomButton from '../src/components/common/CustomButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  addFavourite,
  addToFavourites,
  removeFavourite,
  removeFromFavourites,
  selectItems,
} from '../store/itemsSlice';
import { chatApi } from '../src/apis/chat';
import CustomModal from '../src/components/common/CustomModal';
import { itemApi } from '../src/apis/item';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';
import _ from 'lodash';


export const ItemDetailsScreen = ({route, navigation}) => {
  const token = useSelector(selectCurrentToken);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const theme = useTheme();
  let {item, itemId} = route.params;
  const [itemData, setItemData] = useState(item);


  const fetchItem = async () => {
    try {
      setLoading(true);
      const data = await itemApi.getItemById(itemId);
      if(data) {
        setItemData(data);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Item not found :(',
        });
        navigation.goBack();
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Error fetching item',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if(!item) {
        fetchItem();
      }
    }, [item, itemId]),
  );

  const {width} = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const currentUser = useSelector(selectCurrentUser);
  const [isFavourite, setIsFavourite] = useState(false);
  const dispatch = useDispatch();

  const handleRent = () => {
    // Implement rental logic
  };

  const handleDelete = async (itemId) => {
    try {
      setLoading(true);
      const {success} = await itemApi.deleteItem(itemId);
      if(success) {
        Toast.show({
          type: 'success',
          text1: 'Item deleted successfully',
        });
        navigation.navigate('MyListings');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error deleting item',
          text2: 'Please try again',
        });
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      Toast.show({
        type: 'error',
        text1: 'Error deleting item',
        text2: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    // Implement edit logic
    Toast.show({
      text1: 'Edit item is not available yet',
      type: 'info',
      position: 'top',
      visibilityTime: 3000,
    });

  };

  const handleContact = async () => {
    setShowModal(!showModal);
    const {ownerId} = item;
    if(ownerId) {
      const chatRoom = await chatApi.createChatRoom(ownerId);
      navigation.navigate('ChatDetails', {chat: chatRoom, roomId: chatRoom.id, token: token, item: item});
    }
  };

  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationDots}>
        {itemData.images?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {backgroundColor: theme.colors.primary},
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  const handleFavourite = async () => {
    const initialFavouriteState = isFavourite;
    try {
      setIsFavourite(!isFavourite);
      if (initialFavouriteState) {
        dispatch(removeFavourite(item));
        await dispatch(removeFromFavourites(item.id)).unwrap();
      } else {
        dispatch(addFavourite(item));
        await dispatch(addToFavourites(item.id)).unwrap();
      }
    } catch (error) {
      setIsFavourite(initialFavouriteState);
      console.log('error in handleFavourite', error);
    }
  };

  const getColor = flag => {
    return flag ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
  };

  return (
    <>
       {loading && <ActivityIndicator size="large" color={theme.colors.primary} />}
      <CustomModal showModal={showModal}>
        <View style={[styles.contactModal, {backgroundColor: getColor(theme.isDark), borderColor: getColor(!theme.isDark), borderWidth: 0.2}]}>
            <CustomText variant="h4" style={{textAlign: 'center'}}> A Message will be sent to the owner </CustomText>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', gap: 10 , paddingHorizontal: 20}}>
            <CustomButton variant="primary" type="action" onPress={() => setShowModal(false)}>
              <CustomText style={{color: colors.white}}>Close</CustomText>
            </CustomButton>
            <CustomButton variant="primary" type="action" onPress={handleContact}>
              <CustomText style={{color: colors.white}}>Send Message</CustomText>
            </CustomButton>
          </View>
        </View>
      </CustomModal>
      {itemData && <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={styles.carouselContainer}>
          <CustomButton style={styles.heartIcon} onPress={handleFavourite}>
            {isFavourite ? (
              <Icon name="heart" size={22} color={theme.colors.primary} />
            ) : (
              <Icon name="heart-o" size={22} color={colors.white} />
            )}
          </CustomButton>
          <Carousel
            loop
            width={width - 40}
            height={300}
            data={itemData.images || []}
            onSnapToItem={setActiveIndex}
            renderItem={({item: image}) => (
              <Image
                source={{uri: image}}
                style={[styles.image, {width: width - 40}]}
                resizeMode="cover"
              />
            )}
          />
          {itemData.images?.length > 1 && renderPaginationDots()}
        </View>
        <CustomText style={[styles.title, {color: theme.colors.text.primary}]}>
          {itemData.title}
        </CustomText>
        <CustomText
          style={[styles.description, {color: theme.colors.text.secondary}]}>
          {itemData.description}
        </CustomText>
        <CustomText
          style={[styles.price, {color: theme.colors.text.secondary}]}>
          ${itemData.price}/day
        </CustomText>

        {itemData.ownerId === currentUser?.id ? (
          <View style={{gap: 10}}>
          <CustomButton
            style={[styles.rentButton, {backgroundColor: theme.colors.primary}]}
            onPress={handleEdit}>
            <CustomText
              variant="h4"
              style={{color: colors.white, fontWeight: '600'}}>
              Edit Item
            </CustomText>
          </CustomButton>
          <CustomButton
            style={[styles.rentButton, {backgroundColor: theme.colors.secondary}]}
            onPress={() => handleDelete(itemData.id)}>
            <CustomText
              variant="h4"
              style={{color: colors.white, fontWeight: '600'}}>
              Delete Item
            </CustomText>
          </CustomButton>
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.rentButton, {backgroundColor: theme.colors.primary}]}
            onPress={() => setShowModal(!showModal)}>
            <CustomText
              variant="h4"
              style={{color: colors.white, fontWeight: '600'}}>
              Contact Owner
            </CustomText>
          </TouchableOpacity>
        )}
      </View> }
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
  carouselContainer: {
    position: 'relative',
    height: 300,
    marginBottom: 20,
  },
  image: {
    height: 300,
    borderRadius: 12,
  },
  paginationDots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    opacity: 1,
    transform: [{scale: 1.2}],
  },
  inactiveDot: {
    opacity: 0.5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 15,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  rentButton: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactModal: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'column',
    gap: 30,
    width: '70%',
    padding: 20,
  }
});

export default ItemDetailsScreen;