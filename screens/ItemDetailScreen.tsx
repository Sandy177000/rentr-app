// screens/ItemDetailsScreen.js
import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import {useSelector} from 'react-redux';
import {selectCurrentToken, selectCurrentUser} from '../store/authSlice';
import Carousel from 'react-native-reanimated-carousel';
import {colors} from '../src/theme/theme';
import {chatApi} from '../src/services/api/index';
import CustomModal from '../src/components/common/CustomModal';
import {itemApi} from '../src/services/api/index';
import Toast from 'react-native-toast-message';
import FavoriteButton from '../src/components/FavoriteButton';
import ScreenHeader from '../src/components/ScreenHeader';
import NewItemForm from '../src/components/NewItemForm';
import CustomText from '../src/components/common/CustomText';
import {Item} from '../src/components/types';
import CustomImage from '../src/components/common/CustomImage';

type ItemDetailsScreenProps = {
  route: {
    params: {
      item: Item;
      itemId: string;
    };
  };
  navigation: any;
};

export const ItemDetailsScreen = ({
  route,
  navigation,
}: ItemDetailsScreenProps) => {
  let {item, itemId} = route.params;
  const token = useSelector(selectCurrentToken);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const theme = useTheme();
  const [itemData, setItemData] = useState<Item>(item);
  const {width} = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const currentUser = useSelector(selectCurrentUser);

  const fetchItem = useCallback(async () => {
    try {
      setLoading(true);
      const itemIdToFetch = itemId || item?.id;
      const data = await itemApi.getItemById(itemIdToFetch);
      if (data) {
        setItemData(data as Item);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Item not found :(',
        });
        navigation.goBack();
      }
    } catch (error: any) {
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

  const handleDelete = async (id: string) => {
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
    } catch (error: any) {
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

  const getColor = (flag: boolean) => {
    return flag ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.85)';
  };

  const renderLoading = () => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  };

  const renderDetails = () => {
    return (
      <View
        style={{
          backgroundColor: theme.colors.surface,
          padding: 20,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
          width: '100%',
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <CustomText variant="h1" bold={700}>
            {itemData.name}
          </CustomText>
          <CustomText variant="h3" bold={700}>
            Rs. {itemData.price}/day
          </CustomText>
        </View>
        <CustomText variant="h4">{itemData.description}</CustomText>
      </View>
    );
  };

  const renderHeader = (data: Item) => {
    return (
      <ScreenHeader styles={styles.screenHeader}>
        <View style={styles.favoriteButton}>
          <FavoriteButton item={data} size={24} />
        </View>
      </ScreenHeader>
    );
  };

  const renderActions = () => {
    return (
      <View style={{padding: 20}}>
        {itemData.ownerId === currentUser?.id ? (
          <View style={{gap: 10, flexDirection: 'row', marginTop: 10}}>
            <TouchableOpacity
              style={[
                styles.rentButton,
                {backgroundColor: theme.colors.primary},
              ]}
              onPress={() => setShowEditModal(!showEditModal)}>
              <CustomText
                variant="h4"
                style={{
                  color: colors.white,
                  fontWeight: '600',
                }}>
                Edit Item
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rentButton, {backgroundColor: theme.colors.error}]}
              onPress={() => handleDelete(itemData.id)}>
              <CustomText
                variant="h4"
                style={{
                  color: colors.white,
                  fontWeight: '600',
                }}>
                Delete Item
              </CustomText>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.rentButton,
              {backgroundColor: theme.colors.primary, width: '100%'},
            ]}
            onPress={() => setShowModal(!showModal)}>
            <CustomText
              variant="h4"
              style={{
                color: colors.white,
                fontWeight: '600',
              }}>
              Contact Owner
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderCarousel = (data: Item) => {
    return (
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={width}
          height={300}
          data={data.images || []}
          onSnapToItem={setActiveIndex}
          renderItem={({item: image}) => (
            <CustomImage
              source={image.uri}
              style={[styles.image]}
            />
          )}
        />
        {data.images?.length > 1 && renderPaginationDots()}
      </View>
    );
  };

  const renderItemDetails = () => {
    if (!itemData) { return null; }
    return (
      <View
        style={[
          styles.container,
          {backgroundColor: theme.colors.background},
        ]}>
        {renderHeader(itemData)}
        {renderCarousel(itemData)}
        {renderDetails()}
        {renderActions()}
      </View>
    );
  };
  return (
    <>
      {loading ? (
        renderLoading()
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
              <CustomText variant="h4">
                A Message will be sent to the owner
              </CustomText>
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
                    {backgroundColor: theme.colors.primary},
                  ]}
                  onPress={() => setShowModal(false)}>
                  <CustomText
                    variant="h4"
                    style={{
                      color: colors.white,
                      fontSize: 13,
                    }}>
                    Cancel
                  </CustomText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    styles.centerContent,
                    {backgroundColor: theme.colors.primary},
                  ]}
                  onPress={handleContact}>
                  <CustomText
                    variant="h4"
                    style={{
                      color: colors.white,
                      fontSize: 13,
                    }}>
                    Send Message
                  </CustomText>
                </TouchableOpacity>
              </View>
            </View>
          </CustomModal>
          {showEditModal && (
            <CustomModal showModal={showEditModal}>
              <NewItemForm
                item={itemData}
                setVisible={setShowEditModal}
                editing={true}
              />
            </CustomModal>
          )}
          {renderItemDetails()}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenHeader: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'transparent',
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
  },
  image: {
    height: 300,
    width: '100%',
    resizeMode: 'cover',
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
    width: '50%',
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
    right: 10,
    zIndex: 1000,
  },
  button: {
    borderRadius: 15,
    flexDirection: 'row',
  },
  centerContent: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ItemDetailsScreen;
