/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '../store/authSlice';
import FastImage from 'react-native-fast-image';
import CustomImage from '../src/components/common/CustomImage';
import Carousel from 'react-native-reanimated-carousel';
import useChatMessages from '../src/hooks/chat/useChatMessages';
import Toast from 'react-native-toast-message';
import Message from '../src/components/Message';
import DateSeparator from '../src/components/DateSeparator';
import {
  TChat,
  TMedia,
  TMessage,
  TParticipant,
  TItem,
} from '../src/components/types';
import {NavigationProp} from '@react-navigation/native';
import {handleMediaPicker} from '../src/utils/utils';

type ChatDetailsProps = {
  route: {
    params: {
      chat: TChat;
      roomId: string;
      token: string;
      item: TItem;
    };
  };
  navigation: NavigationProp<any>;
};

const ChatDetails = ({route, navigation}: ChatDetailsProps) => {
  const theme = useTheme();
  const {chat, roomId, token, item} = route.params;
  const user = useSelector(selectCurrentUser);
  const flatListRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const modalHeight = useRef(new Animated.Value(0)).current;
  const participant = chat?.participants?.filter(
    (p: TParticipant) => p.user?.id !== user?.id,
  );
  const [selectedImages, setSelectedImages] = useState<TMedia[]>([]);
  const [showImageCarousel, setShowImageCarousel] = useState(false);
  const width = Dimensions.get('window').width;
  const handleModal = () => {
    Animated.timing(modalHeight, {
      toValue: showModal ? 0 : 150,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setShowModal(!showModal);
  };
  const {
    loadingMessage,
    loading,
    message,
    messages,
    media,
    setMessage,
    addMedia,
    removeMedia,
    sendMessage,
    handleLoadMore,
  } = useChatMessages(roomId, token, user, item, handleModal);

  useEffect(() => {
    let title = participant
      .map((p: TParticipant) => p.user?.firstName)
      .join(', ');
    navigation.setOptions({
      title: title,
    });
  }, [navigation, chat, roomId, user?.id, participant]);

  

  const handleImagePicker = async (source: string) => {
    handleMediaPicker(source, (asset: any) => {
      addMedia(asset);
    });
  };

  const handleMessageLink = useCallback(
    (link: any) => {
      try {
        navigation.navigate(link.screen, link.params);
      } catch (error) {
        console.log(error);
        Toast.show({
          text1: 'Error',
          text2: 'Failed to navigate to the link',
          type: 'error',
        });
      }
    },
    [navigation],
  );

  const renderMessage = ({
    item: messageItem,
    index,
  }: {
    item: TMessage;
    index: number;
  }) => {
    return (
      <>
        <DateSeparator
          currentMessage={messages[messages.length - index]}
          previousMessage={messages[messages.length - index - 1]}
          index={index}
        />
        <Message
          key={messageItem.id}
          item={messageItem}
          theme={theme}
          user={user}
          setSelectedImages={setSelectedImages}
          setShowImageCarousel={setShowImageCarousel}
          handleMessageLink={handleMessageLink}
        />
      </>
    );
  };

  const renderCarouselPreview = () => {
    return (
      showImageCarousel &&
      selectedImages && (
        <View style={styles.carouselModal}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowImageCarousel(false)}>
            <Icon name="close" size={24} color="#FFF" />
          </TouchableOpacity>
          <Carousel
            loop
            width={width}
            height={width}
            data={selectedImages}
            renderItem={({item: carouselImage}: {item: TMedia}) => (
              <FastImage
                source={{uri: carouselImage.uri}}
                style={{width: width, height: width}}
                resizeMode={FastImage.resizeMode.contain}
              />
            )}
          />
        </View>
      )
    );
  };

  const renderInputSection = () => {
    return (
      <View style={{backgroundColor: theme.colors.background}}>
        {renderInputMediaPreview(media)}
        <View
          style={[
            styles.inputContainer,
            {backgroundColor: theme.colors.surface},
          ]}>
          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: theme.colors.primary, marginLeft: 5},
            ]}
            activeOpacity={0.9}
            onPress={handleModal}>
            <Icon
              name={showModal ? 'close' : 'plus'}
              size={15}
              color={'#FFFFFF'}
            />
          </TouchableOpacity>
          <TextInput
            style={{flex: 1, marginLeft: 5, color: theme.colors.text.primary}}
            value={message}
            onChangeText={setMessage}
            placeholder="Message..."
            placeholderTextColor={theme.colors.text.secondary}
            multiline
          />
          {(message.trim().length > 0 || media.length > 0) && (
            <TouchableOpacity
              onPress={sendMessage}
              style={[
                styles.button,
                {backgroundColor: theme.colors.primary, padding: 0},
              ]}
              disabled={loadingMessage}
              activeOpacity={0.9}>
              {loadingMessage ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Icon name="send" size={15} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderInputMediaPreview = (mediaData: TMedia[]) => {
    return (
      mediaData.length > 0 && (
        <View style={styles.imageSection}>
          <ScrollView
            style={styles.imagePreviewContainer}
            showsHorizontalScrollIndicator={false}
            horizontal={true}>
            {mediaData.map((image: TMedia, index: number) => (
              <View key={index} style={styles.imagePreview}>
                <CustomImage source={image.uri} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeMedia(index)}
                  activeOpacity={0.9}>
                  <Icon
                    name="times-circle"
                    size={24}
                    color={theme.colors.error}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      )
    );
  };

  const renderImagePickerModal = () => {
    return (
      <Animated.View style={[styles.modalContainer, {height: modalHeight}]}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.colors.primary}]}
          onPress={() => handleImagePicker('camera')}
          activeOpacity={0.9}>
          <Icon name="camera" size={15} color={'#FFFFFF'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme.colors.primary}]}
          onPress={() => handleImagePicker('gallery')}
          activeOpacity={0.9}>
          <Icon name="image" size={15} color={'#FFFFFF'} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {!loading ? (
        <FlatList
          ref={flatListRef}
          style={{backgroundColor: theme.colors.surface}}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          data={[...messages].reverse()}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          inverted={true}
          keyExtractor={item => item.id}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}
      {renderImagePickerModal()}
      {renderInputSection()}
      {renderCarouselPreview()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 0,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageList: {
    padding: 16,
  },
  message: {
    flexDirection: 'row',
    gap: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 30,
    margin: 8,
    width: '95%',
    maxHeight: 100,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  button: {
    width: 35,
    height: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    width: 40,
    marginHorizontal: 14,
    gap: 8,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 10,
    left: 5,
    zIndex: 0,
  },
  imageSection: {
    flexDirection: 'row',
    width: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.33)',
    position: 'absolute',
    bottom: 80,
    right: 10,
    zIndex: 0,
    borderRadius: 10,
  },
  imagePreviewContainer: {
    padding: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  messageImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  imageCountOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCountText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  carouselModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1001,
    padding: 10,
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateSeparatorText: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});

export default ChatDetails;
