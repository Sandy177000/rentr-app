/* eslint-disable react-native/no-inline-styles */
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Animated,
  Alert,
  Platform,
  Linking,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import {useTheme} from '../src/theme/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomText from '../src/components/common/CustomText';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '../store/authSlice';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import {CustomImage} from '../src/components/common/CustomImage';
import Carousel from 'react-native-reanimated-carousel';
import { formatDate, renderDateSeparator } from '../src/utils/utils';
import useChatMessages from '../src/hooks/chat/useChatMessages';
import Markdown from 'react-native-markdown-display';

const ChatDetails = ({route, navigation}) => {
  const theme = useTheme();
  const {chat, roomId, token, item} = route.params;
  const user = useSelector(selectCurrentUser);
  const flatListRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const modalHeight = useRef(new Animated.Value(0)).current;
  const participant = chat?.participants?.filter(p => p.user.id !== user.id);
  const [selectedImages, setSelectedImages] = useState(null);
  const [showImageCarousel, setShowImageCarousel] = useState(false);
  const width = Dimensions.get('window').width;
  
  const {
    loading,
    loadingMessage,
    message,
    messages,
    media,
    setMessage,
    addMedia,
    removeMedia,
    sendMessage,
    fetchMessages,
    handleLoadMore,
  } = useChatMessages(roomId, token, user, item);

  useEffect(() => {
    let title = participant.map(p => p.user.firstName).join(', ');
    navigation.setOptions({
      title: title,
    });
  }, [navigation, chat, roomId, user.id]);

  // // Add this function to scroll to the bottom
  // const scrollToBottom = useCallback(() => {
  //   if (flatListRef.current && messages.length > 0) {
  //     flatListRef.current.scrollToEnd({animated: true});
  //   }
  // }, [messages]);

  const handleModal = () => {
    Animated.timing(modalHeight, {
      toValue: showModal ? 0 : 150,
      duration: 200,
      useNativeDriver: false,
    }).start();
    setShowModal(!showModal);
  };

  const handleImagePicker = async source => {
    const options = {
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 1200,
      saveToPhotos: true,
    };
    try {
      let response;
      if (source === 'camera') {
        response = await launchCamera(options);
      }
      if (source === 'gallery') {
        response = await launchImageLibrary(options);
      }

      // Handle camera permissions
      if (response.errorCode === 'others') {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access in your device settings.',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        return;
      }

      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        console.error('ImagePicker Error:', response);
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        addMedia(asset);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderMessage = ({item: messageItem, index}) => {
    const prevMessage = messages[index + 1];
    const showDateSeparator = renderDateSeparator(messageItem, prevMessage);
    return (
      <>
        <View
          key={`${index} ${messageItem.createdAt}`}
          style={[
            styles.message,
            messageItem.sender.id === user.id ? styles.myMessage : styles.theirMessage,
          ]}>
          <View
            style={[
              styles.messageBubble,
              {
                backgroundColor:
                  messageItem.sender.id === user.id
                    ? theme.colors.primary
                    : theme.colors.background,
              },
            ]}>
            {messageItem.media && messageItem.media.length > 0 && (
              <View
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  padding: 3,
                  borderRadius: 10,
                }}>
                <View style={{width: 250}}>
                  {messageItem.media.length <= 3 ? (
                    messageItem.media.map((image, messageItemIndex) => (
                      <TouchableOpacity
                        key={messageItemIndex}
                        onPress={() => {
                          setSelectedImages(messageItem.media);
                          setShowImageCarousel(true);
                        }}>
                        <FastImage
                          source={{uri: image}}
                          style={[styles.messageImage, {marginBottom: 5}]}
                          resizeMode={FastImage.resizeMode.cover}
                          onLoadStart={() => <View style={styles.messageImage} />}
                        />
                      </TouchableOpacity>))
                  ) : (
                    <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                      {messageItem.media.slice(0, 4).map((image, messageItemIndex) => (
                        <TouchableOpacity
                          key={messageItemIndex}
                          onPress={() => {
                            setSelectedImages(messageItem.media);
                            setShowImageCarousel(true);
                          }}>
                          <FastImage
                            source={{uri: image}}
                            style={{
                              width: 120,
                              height: 120,
                              borderRadius: 10,
                              margin: 2,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                          {index === 3 && messageItem.media.length > 4 && (
                            <View style={styles.imageCountOverlay}>
                              <CustomText style={styles.imageCountText}>
                                +{messageItem.media.length - 4}
                              </CustomText>
                            </View>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}
            <Markdown
              style={{
                body: {
                  color: messageItem.sender.id === user.id 
                    ? '#FFFFFF' 
                    : theme.colors.text.primary,
                  fontSize: 14,
                  marginLeft: 5,
                },
                // Style for links
                link: {
                  color: theme.colors.primary,
                  textDecorationLine: 'underline',
                },
                // Style for code blocks
                code_block: {
                  backgroundColor: theme.colors.surface,
                  padding: 8,
                  borderRadius: 4,
                },
                // Style for inline code
                code_inline: {
                  backgroundColor: theme.colors.surface,
                  padding: 4,
                  borderRadius: 2,
                }
              }}>
              {messageItem.content}
            </Markdown>
            <CustomText
              variant="h4"
              style={[
                styles.timestamp,
                {
                  color:
                    messageItem.sender.id === user.id
                      ? 'rgba(255, 255, 255, 0.7)'
                      : theme.colors.text.secondary,
                },
              ]}>
              {messageItem.createdAt
                ? new Date(messageItem.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </CustomText>
          </View>
        </View>
        {/* {showDateSeparator && (
          <View style={styles.dateSeparator}>
            <CustomText
              variant="h4"
              style={[styles.dateSeparatorText, { color: theme.colors.text.secondary }]}
            >
              {formatDate(messageItem.createdAt)}
            </CustomText>
          </View>
        )} */}
      </>
    );
  };

  const renderCarouselPreview = () => {
    return (
      showImageCarousel && selectedImages && (
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
            renderItem={({item: carouselImage}) => (
              <FastImage
                source={{uri: carouselImage}}
                style={{width: width, height: width}}
                resizeMode={FastImage.resizeMode.contain}
              />
            )}
          />
        </View>
      )
    )
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
              disabled={loadingMessage}>
              {
                loadingMessage ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Icon name="send" size={15} color="#FFFFFF" />
                )
              }
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderInputMediaPreview = (mediaData) => {
    return (
      mediaData.length > 0 && (
        <View style={styles.imageSection}>
          <ScrollView
            style={styles.imagePreviewContainer}
            showsHorizontalScrollIndicator={false}
            horizontal={true}>
            {mediaData.map((image, index) => (
              <View key={index} style={styles.imagePreview}>
                <CustomImage source={image.uri} style={styles.previewImage} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeMedia(index)}>
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
    )
  };

  const renderImagePickerModal = () => {
    return (
      <Animated.View style={[styles.modalContainer, {height: modalHeight}]}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.colors.primary}]}
            onPress={() => handleImagePicker('camera')}>
            <Icon name="camera" size={15} color={'#FFFFFF'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: theme.colors.primary}]}
            onPress={() => handleImagePicker('gallery')}>
            <Icon name="image" size={15} color={'#FFFFFF'} />
          </TouchableOpacity>
        </Animated.View>
    );
  };

  return (
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          style={{backgroundColor: theme.colors.surface}}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => fetchMessages(1, false)}
            />
          }
          data={[...messages].reverse()}
          renderItem={renderMessage}
          keyExtractor={i => i.id}
          contentContainerStyle={styles.messageList}
          inverted={true}
        />
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
  messageBubble: {
    maxWidth: 270,
    minWidth: 70,
    padding: 5,
    borderRadius: 12,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  timestamp: {
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 4,
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
    bottom: 0,
    left: 0,
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
