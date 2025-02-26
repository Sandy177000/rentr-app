// screens/ItemDetailsScreen.js
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import CustomText from '../src/components/common/CustomText';
import {useSelector} from 'react-redux';
import {selectCurrentToken, selectCurrentUser} from '../store/authSlice';
import { chatApi } from '../src/apis/chat';
import Carousel from 'react-native-reanimated-carousel';

export const ItemDetailsScreen = ({route, navigation}) => {
  const token = useSelector(selectCurrentToken);
  const theme = useTheme();
  const {item} = route.params;
  const {width} = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const currentUser = useSelector(selectCurrentUser);

  const handleRent = () => {
    // Implement rental logic
  };

  const handleDelete = () => {
    // Implement delete logic
  };

  const handleEdit = () => {
    // Implement edit logic
  };

  const handleContact = async () => {
    const {ownerId} = item;
    if(ownerId) {
      const chatRoom = await chatApi.createChatRoom(ownerId);
      navigation.navigate('ChatDetails', {chat: chatRoom, roomId: chatRoom.id, token: token, item: item});
    }
  };

  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationDots}>
        {item.images?.map((_, index) => (
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

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.carouselContainer}>
        <Carousel
          loop
          width={width - 40}
          height={300}
          data={item.images || []}
          onSnapToItem={setActiveIndex}
          renderItem={({item: image}) => (
            <Image
              source={{uri: image}}
              style={[styles.image, {width: width - 40}]}
              resizeMode="cover"
            />
          )}
        />
        {item.images?.length > 1 && renderPaginationDots()}
      </View>
      <CustomText style={[styles.title, {color: theme.colors.text.primary}]}>
        {item.title}
      </CustomText>
      <CustomText
        style={[styles.description, {color: theme.colors.text.secondary}]}>
        {item.description}
      </CustomText>
      <CustomText style={[styles.price, {color: theme.colors.text.secondary}]}>
        ${item.price}/day
      </CustomText>

      {item.ownerId === currentUser.id ? (
        <TouchableOpacity
          style={[styles.rentButton, {backgroundColor: theme.colors.primary}]}
          onPress={handleRent}>
          <CustomText style={{color: '#FFFFFF', fontWeight: '600'}}>
            Rent Now
          </CustomText>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.rentButton, {backgroundColor: theme.colors.primary}]}
          onPress={handleContact}>
          <CustomText style={{color: '#FFFFFF', fontWeight: '600'}}>
            Contact Owner
          </CustomText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
})