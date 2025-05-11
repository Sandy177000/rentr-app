// screens/ItemDetailsScreen.tsx
import React, {useCallback, useEffect, useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  ActivityIndicator,
  ScrollView,
  Platform,
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
import {TItem} from '../src/components/types';
import CustomImage from '../src/components/common/CustomImage';
import Chip from '../src/components/Chip';
import Icon from 'react-native-vector-icons/FontAwesome';
import {formatDate, isAvailable, getColor} from '../src/utils/utils';
import ShimmerItemDetails from '../src/components/common/ShimmerItemDetails';

type ItemDetailsScreenProps = {
  route: {
    params: {
      item: TItem;
      itemId: string;
      showFavorite?: boolean;
    };
  };
  navigation: any;
};

export const ItemDetailsScreen = ({
  route,
  navigation,
}: ItemDetailsScreenProps) => {
  let {item, itemId, showFavorite} = route.params;
  const token = useSelector(selectCurrentToken);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const theme = useTheme();
  const [itemData, setItemData] = useState<TItem>(item);
  const {width} = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const currentUser = useSelector(selectCurrentUser);

  // Calculate card heights
  const imageHeight = width * 0.8;

  const fetchItem = useCallback(async () => {
    try {
      setLoading(true);
      const itemIdToFetch = itemId || item?.id;
      const data = await itemApi.getItemById(itemIdToFetch);
      if (data) {
        setItemData(data as TItem);
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

  const handleDelete = async (id: string | undefined) => {
    if (!id) {
      Toast.show({
        type: 'error',
        text1: 'Item not found',
      });
      return;
    }
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

  // Availability status
  const isItemAvailable = useMemo(() => {
    return itemData?.dateRange ? isAvailable(itemData.dateRange) : false;
  }, [itemData?.dateRange]);

  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationDots}>
        {itemData.images?.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {backgroundColor: theme.colors.surface},
              index === activeIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    );
  };

  const renderAvailability = () => {
    if (!itemData?.dateRange) {
      return null;
    }

    return (
      <View style={styles.availabilityContainer}>
        <View
          style={[
            styles.availabilityBadge,
            {
              backgroundColor: isItemAvailable
                ? 'rgba(11, 209, 70, 0.9)'
                : theme.colors.error + 'E6',
            },
          ]}>
          <Icon
            name={isItemAvailable ? 'check-circle' : 'close'}
            size={16}
            color={colors.white}
          />
          <CustomText style={styles.availabilityText}>
            {isItemAvailable ? 'Available' : 'Not Available'}
          </CustomText>
        </View>
      </View>
    );
  };

  const renderHeader = (data: TItem) => {
    return (
      <ScreenHeader styles={styles.screenHeader}>
        {showFavorite && (
          <View style={styles.favoriteButton}>
            <FavoriteButton item={data} size={24} />
          </View>
        )}
      </ScreenHeader>
    );
  };

  const renderCarousel = (data: TItem) => {
    return (
      <View style={[styles.carouselContainer, {height: imageHeight}]}>
        <Carousel
          loop
          width={width}
          height={imageHeight}
          data={data.images || []}
          onSnapToItem={setActiveIndex}
          renderItem={({item: image}) => (
            <View style={{position: 'relative', width: '100%', height: '100%'}}>
              <CustomImage source={image.uri} style={styles.image} />
            </View>
          )}
        />
        {data.images?.length > 1 && renderPaginationDots()}
        {renderAvailability()}
      </View>
    );
  };

  const renderItemActions = () => {
    return (
      <View style={styles.actionsContainer}>
        {itemData.ownerId === currentUser?.id ? (
          <View style={styles.ownerActionsRow}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {backgroundColor: theme.colors.primary},
              ]}
              onPress={() => setShowEditModal(!showEditModal)}>
              <Icon name="pencil" size={20} color={colors.white} />
              <CustomText style={styles.actionButtonText}>Edit</CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                {backgroundColor: theme.colors.error},
              ]}
              onPress={() => handleDelete(itemData.id)}>
              <Icon name="trash" size={20} color={colors.white} />
              <CustomText style={styles.actionButtonText}>Delete</CustomText>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.contactButton,
              {backgroundColor: theme.colors.primary},
            ]}
            onPress={() => setShowModal(!showModal)}>
            <Icon name="user" size={15} color={colors.white} />
            <CustomText style={styles.contactButtonText}>
              Contact Owner
            </CustomText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderDetails = () => {
    return (
      <ScrollView
        style={styles.detailsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 100}}>
        {/* Item Title and Price */}
        <View style={styles.titlePriceContainer}>
          <CustomText variant="h2" style={styles.itemTitle} bold={700}>
            {itemData.name}
          </CustomText>
          <View style={styles.priceContainer}>
            <CustomText
              variant="h3"
              bold={700}
              style={{color: theme.colors.primary}}>
              Rs. {itemData.price}
            </CustomText>
            <CustomText style={styles.priceUnit}>/day</CustomText>
          </View>
        </View>

        {/* Category */}
        <View style={styles.categoryContainer}>
          <Chip
            item={{name: itemData.category}}
            style={[
              styles.categoryChip,
              {backgroundColor: theme.colors.surface},
            ]}
            navigation={navigation}
            navigationData={{
              navigateTo: 'CategoryItems',
              data: {category: itemData.category},
            }}
            textStyle={{color: theme.colors.text.primary}}
          />
        </View>

        {/* Dates */}
        <View
          style={[
            styles.datesContainer,
            {backgroundColor: theme.colors.surface},
          ]}>
          <View style={styles.dateRow}>
            <Icon name="angle-right" size={18} color={theme.colors.primary} />
            <CustomText style={{color: theme.colors.text.secondary}}>
              Available from:
            </CustomText>
            <CustomText bold={600} style={{color: theme.colors.text.primary}}>
              {formatDate(itemData.dateRange?.startDate)}
            </CustomText>
          </View>
          <View style={styles.dateRow}>
            <Icon name="angle-right" size={18} color={theme.colors.primary} />
            <CustomText style={{color: theme.colors.text.secondary}}>
              Available until:
            </CustomText>
            <CustomText bold={600} style={{color: theme.colors.text.primary}}>
              {formatDate(itemData.dateRange?.endDate)}
            </CustomText>
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <CustomText variant="h3" bold={700} style={styles.sectionTitle}>
            Description
          </CustomText>
          <CustomText
            style={[
              styles.descriptionText,
              {color: theme.colors.text.secondary},
            ]}>
            {itemData.description}
          </CustomText>
        </View>

        {/* Action Buttons */}
        {renderItemActions()}
      </ScrollView>
    );
  };

  const renderItemDetails = () => {
    if (!itemData) {
      return null;
    }
    return (
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        {renderHeader(itemData)}
        {renderCarousel(itemData)}
        {renderDetails()}
      </View>
    );
  };

  if (loading) {
    return <ShimmerItemDetails />;
  }

  return (
    <>
      <CustomModal showModal={showModal}>
        <View
          style={[
            styles.contactModal,
            {
              backgroundColor: getColor(theme.isDark),
            },
          ]}>
          <View style={styles.modalHeader}>
            <Icon name="user" size={30} color={theme.colors.primary} />
            <CustomText
              variant="h3"
              bold={600}
              style={{color: theme.colors.text.primary}}>
              Contact Owner
            </CustomText>
          </View>

          <CustomText
            variant="h4"
            style={[styles.modalMessage, {color: theme.colors.text.secondary}]}>
            A message will be sent to the owner of this item. Continue?
          </CustomText>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[
                styles.modalButton,
                {
                  backgroundColor: 'transparent',
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                },
              ]}
              onPress={() => setShowModal(false)}>
              <CustomText variant="h4" style={{color: theme.colors.text.primary}}>
                Cancel
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modalButton,
                {backgroundColor: theme.colors.primary},
              ]}
              onPress={handleContact}>
              <CustomText variant="h4" style={{color: colors.white}}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenHeader: {
    position: 'absolute',
    width: '100%',
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  carouselContainer: {
    position: 'relative',
    width: '100%',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  paginationDots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 20,
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
  favoriteButton: {
    position: 'absolute',
    right: 10,
    zIndex: 1000,
  },
  availabilityContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  availabilityText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  titlePriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemTitle: {
    flex: 2,
    marginRight: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceUnit: {
    fontSize: 14,
    marginLeft: 2,
    opacity: 0.7,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datesContainer: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
  },
  descriptionText: {
    lineHeight: 22,
    fontSize: 15,
  },
  actionsContainer: {
    marginTop: 10,
  },
  ownerActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  contactButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  contactModal: {
    borderRadius: 20,
    width: '85%',
    padding: 22,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  modalMessage: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
});

export default ItemDetailsScreen;
