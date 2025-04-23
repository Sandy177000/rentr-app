// screens/ItemDetailsScreen.js
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Text,
} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import {useSelector} from 'react-redux';
import {selectCurrentToken, selectCurrentUser} from '../store/authSlice';
import Carousel from 'react-native-reanimated-carousel';
import {colors} from '../src/theme/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import {chatApi} from '../src/services/api/index';
import CustomModal from '../src/components/common/CustomModal';
import {itemApi} from '../src/services/api/index';
import Toast from 'react-native-toast-message';
import FavoriteButton from '../src/components/FavoriteButton';

export const ItemDetailsScreen = ({route, navigation}) => {
  let {item, itemId} = route.params;
  const token = useSelector(selectCurrentToken);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const theme = useTheme();
  const [itemData, setItemData] = useState(item);
  const {width} = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const currentUser = useSelector(selectCurrentUser);

  const fetchItem = useCallback(async () => {
    try {
      setLoading(true);
      const itemIdToFetch = itemId || item?.id;
      const data = await itemApi.getItemById(itemIdToFetch);
      if (data) {
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
  }, [item, itemId, navigation]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  const handleRent = () => {
    // Implement rental logic
  };

  const handleDelete = async id => {
    try {
      setLoading(true);
      const {success} = await itemApi.deleteItem(id);
      if (success) {
        Toast.show({
          type: 'success',
          text1: 'Item deleted successfully',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error deleting item',
          text2: 'Please try again',
        });
      }
      navigation.reset({
        index: 0,
        routes: [{name: 'MainTabs', params: {initialIndex: 3}}],
      });
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
    const {ownerId} = itemData;
    if (ownerId) {
      const chatRoom = await chatApi.createChatRoom(ownerId);
      navigation.navigate('ChatDetails', {
        chat: chatRoom,
        roomId: chatRoom.id,
        token: token,
        item: itemData,
      });
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

  const getColor = flag => {
    return flag ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
  };

  const renderLoading = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  };

  // Helper function to get text style based on variant (like CustomText)
  const getTextStyle = (variant) => {
    switch (variant) {
      case 'h1': return { fontSize: 19 };
      case 'h2': return { fontSize: 17 };
      case 'h3': return { fontSize: 15 };
      case 'h4': return { fontSize: 13 };
      case 'h5': return { fontSize: 11 };
      case 'h6': return { fontSize: 9 };
      case 'h7': return { fontSize: 7 };
      default: return { fontSize: 11 };
    }
  };

  return (
    <>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          <CustomModal showModal={showModal}>
            <View
              style={[
                styles.contactModal,
                {
                  backgroundColor: getColor(theme.isDark),
                  borderColor: getColor(!theme.isDark),
                  borderWidth: 0.2,
                },
              ]}>
              <Text 
                style={[
                  getTextStyle('h4'), 
                  {
                    textAlign: 'center',
                    color: theme.colors.text.primary,
                    fontFamily: theme.font
                  }
                ]}>
                {' '}
                A Message will be sent to the owner{' '}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 10,
                  paddingHorizontal: 20,
                }}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.centerContent,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={() => setShowModal(false)}>
                  <Text style={{color: colors.white, fontSize: 13, fontFamily: theme.font}}>
                    Close
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.centerContent,
                    { backgroundColor: theme.colors.primary },
                  ]}
                  onPress={handleContact}>
                  <Text style={{color: colors.white, fontSize: 13, fontFamily: theme.font}}>
                    Send Message
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </CustomModal>
          {itemData && (
            <View
              style={[
                styles.container,
                {backgroundColor: theme.colors.background},
              ]}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderRadius: 100,
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  zIndex: 1000,
                  width: 35,
                  height: 35,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  name="angle-left"
                  size={25}
                  color={theme.colors.text.secondary}
                />
              </TouchableOpacity>
              <View style={styles.carouselContainer}>
                <View style={styles.favoriteButton}>
                  <FavoriteButton item={itemData} size={24} />
                </View>
                <Carousel
                  loop
                  width={width}
                  height={300}
                  data={itemData.images || []}
                  onSnapToItem={setActiveIndex}
                  renderItem={({item: image}) => (
                    <Image
                      source={{uri: image}}
                      style={[styles.image]}
                      resizeMode="cover"
                    />
                  )}
                />
                {itemData.images?.length > 1 && renderPaginationDots()}
              </View>

              <View style={{padding: 20}}>
                <Text
                  style={[
                    styles.title, 
                    {color: theme.colors.text.primary, fontFamily: theme.font}
                  ]}>
                  {itemData.name}
                </Text>
                <Text
                  style={[
                    styles.description,
                    {color: theme.colors.text.secondary, fontFamily: theme.font},
                  ]}>
                  {itemData.description}
                </Text>
                <Text
                  style={[
                    styles.price, 
                    {color: theme.colors.text.secondary, fontFamily: theme.font}
                  ]}>
                  Rs. {itemData.price}/day
                </Text>

                {itemData.ownerId === currentUser?.id ? (
                  <View style={{gap: 10}}>
                    <TouchableOpacity
                      style={[
                        styles.rentButton,
                        {backgroundColor: theme.colors.error},
                      ]}
                      onPress={() => handleDelete(itemData.id)}>
                      <Text
                        style={[
                          getTextStyle('h4'),
                          {color: colors.white, fontWeight: '600', fontFamily: theme.font}
                        ]}>
                        Delete Item
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={[
                      styles.rentButton,
                      {backgroundColor: theme.colors.primary},
                    ]}
                    onPress={() => setShowModal(!showModal)}>
                    <Text
                      style={[
                        getTextStyle('h4'),
                        {color: colors.white, fontWeight: '600', fontFamily: theme.font}
                      ]}>
                      Contact Owner
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
  },
  heartIcon: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 1000,
  },
  carouselContainer: {
    position: 'relative',
    height: 300,
    width: '100%',
    marginBottom: 20,
  },
  image: {
    height: 300,
    width: '100%',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
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
    borderRadius: 30,
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
  },
  categoryItem: {
    flex: 1,
    height: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
    maxWidth: 100,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1000,
  },
  // Added styles from CustomButton
  button: {
    borderRadius: 30,
    flexDirection: 'row',
  },
  centerContent: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ItemDetailsScreen;
