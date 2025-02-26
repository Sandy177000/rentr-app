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
} from 'react-native';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useTheme} from '../src/theme/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomText from '../src/components/common/CustomText';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '../store/authSlice';
import {chatApi} from '../src/apis/chat';
import io from 'socket.io-client';
import {getBaseUrl} from '../src/apis/constants';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';
import {CustomImage} from '../src/components/common/CustomImage';
import Carousel from 'react-native-reanimated-carousel';

const ChatDetails = ({route, navigation}) => {
  const theme = useTheme();
  const {chat, roomId, token, item} = route.params;
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const user = useSelector(selectCurrentUser);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const flatListRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const modalHeight = useRef(new Animated.Value(0)).current;
  const [media, setMedia] = useState([]);
  const participant = chat?.participants?.filter(
    participant => participant.user.id !== user.id,
  );
  const [selectedImages, setSelectedImages] = useState(null);
  const [showImageCarousel, setShowImageCarousel] = useState(false);
  const width = Dimensions.get('window').width;

  useEffect(() => {
    let title = participant.map(p => p.user.firstName).join(', ');
    navigation.setOptions({
      title: title,
    });
  }, [navigation, chat, roomId, user.id]);

  // Initialize socket connection
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    let newSocket;
    try {
      const baseUrl = getBaseUrl();
      newSocket = io(baseUrl, {
        auth: {
          token: token,
        },
      });

      // Remove the emit('connection') - Socket.IO handles this automatically
      newSocket.on('connect', () => {
        console.log('Connected to socket');
        newSocket.emit('join_room', roomId);
      });

      setSocket(newSocket);
    } catch (error) {
      console.log('error in socket', error);
    } finally {
      setLoading(false);
    }

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.emit('leave_room', roomId);
        newSocket.disconnect();
      }
    };
  }, [roomId, token]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    socket.on('new_message', newMessage => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('new_message');
    };
  }, [socket]);

  //  effect to handle initial message when coming from Contact Owner
  useEffect(() => {
    const sendInitialMessage = async () => {
      if (item && !loading) {
        // Only send if we have an item and loading is complete
        try {
          let imageUrls = item.images || []; // Use the item's images

          const content = `I am interested in this item for rent.Can we connect to discuss the details.
          Item Name: ${item.name}
          Item Price: ${item.price}
          Item Description: ${item.description}
          `;

          let newMessage = {
            content: content,
            senderId: user.id,
            chatRoomId: roomId,
            media: imageUrls.length > 0 ? [imageUrls[0]] : [],
            createdAt: new Date(),
            updatedAt: new Date(),
            sender: {
              id: user.id,
            },
          };

          socket.emit('send_message', newMessage);

          await chatApi.sendMessage({
            content: content,
            chatRoomId: roomId,
            media: imageUrls,
          });
        } catch (error) {
          console.log('error sending initial message', error);
        }
      }
    };

    if (item) {
      // Only run this if we came from Contact Owner
      sendInitialMessage();
    }
  }, [item, loading, roomId, user.id, socket]);

  const sendMessage = async () => {
    setLoadingMessage(true);
    let tempMedia = media;
    let tempMessage = message;
    setMedia([]);
    setMessage('');

    try {
      if (tempMessage.trim().length > 0) {
        // Emit message to socket server
        let imageUrls = [];
        if (tempMedia.length > 0) {
          const mediaData = new FormData();
          tempMedia.forEach(item => {
            mediaData.append('images', {
              uri: item.uri,
              type: item.type,
              name: item.fileName,
            });
          });
          imageUrls = await chatApi.mediaUpload(mediaData);
        }

        let newMessage = {
          content: tempMessage,
          senderId: user.id,
          chatRoomId: roomId,
          media: imageUrls,
          createdAt: new Date(),
          updatedAt: new Date(),
          sender: {
            id: user.id,
          },
        };

        socket.emit('send_message', newMessage);
        console.log('newMessage', newMessage);

        await chatApi.sendMessage({
          content: tempMessage,
          chatRoomId: roomId,
          media: imageUrls,
        });
      }
    } catch (error) {
      console.log('error in send message', error);
    } finally {
      setLoadingMessage(false);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    const messagesData = await chatApi.getChatMessages(roomId);
    setMessages(messagesData);
    setLoading(false);
  };
  useEffect(() => {
    fetchMessages();
  }, [roomId]);

  const renderMessage = ({item, index}) => {
    return (
      <View
        key={`${index} ${item.id}`}
        style={[
          styles.message,
          item.sender.id === user.id ? styles.myMessage : styles.theirMessage,
        ]}>
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor:
                item.sender.id === user.id
                  ? theme.colors.primary
                  : theme.colors.background,
            },
          ]}>
          {item.media && item.media.length > 0 && (
            <View
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                padding: 3,
                borderRadius: 10,
              }}>
              <View style={{width: 250}}>
                {item.media.length <= 3 ? (
                  item.media.map((image, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        setSelectedImages(item.media);
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
                    {item.media.slice(0, 4).map((image, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setSelectedImages(item.media);
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
                        {index === 3 && item.media.length > 4 && (
                          <View style={styles.imageCountOverlay}>
                            <CustomText style={styles.imageCountText}>
                              +{item.media.length - 4}
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
          <CustomText
            variant="h3"
            style={[
              {
                color:
                  item.sender.id === user.id
                    ? '#FFFFFF'
                    : theme.colors.text.primary,
                marginLeft: 5,
              },
            ]}>
            {item.content}
          </CustomText>
          <CustomText
            variant="h4"
            style={[
              styles.timestamp,
              {
                color:
                  item.sender.id === user.id
                    ? 'rgba(255, 255, 255, 0.7)'
                    : theme.colors.text.secondary,
              },
            ]}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </CustomText>
        </View>
      </View>
    );
  };

  // Add this function to scroll to the bottom
  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  // Add this effect to scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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
        setMedia(prevMedia => [...prevMedia, asset]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeMedia = index => {
    setMedia(prevMedia => prevMedia.filter((_, i) => i !== index));
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {backgroundColor: theme.colors.background, zIndex: 0},
        ]}>
        <FlatList
          ref={flatListRef}
          style={{backgroundColor: theme.colors.surface}}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchMessages} />
          }
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messageList}
          inverted={false}
          // onContentSizeChange={scrollToBottom} // Scroll when content size changes
          onLayout={scrollToBottom} // Scroll on initial layout
        />
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

        <View style={{backgroundColor: theme.colors.background}}>
          {media.length > 0 && (
            <View style={styles.imageSection}>
              <ScrollView
                style={styles.imagePreviewContainer}
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                {media.map((image, index) => (
                  <View key={index} style={styles.imagePreview}>
                    <CustomImage
                      source={image.uri}
                      style={styles.previewImage}
                    />
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
          )}
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
            {message.trim().length > 0 && (
              <TouchableOpacity
                onPress={sendMessage}
                style={[
                  styles.button,
                  {backgroundColor: theme.colors.primary, padding: 0},
                ]}
                disabled={message.trim().length === 0}>
                {loadingMessage ? (
                  <View style={{padding: 5}}>
                    <CustomText variant="h4" style={{color: '#FFFFFF'}}>
                      Sending...
                    </CustomText>
                  </View>
                ) : (
                  <Icon name="send" size={15} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {showImageCarousel && selectedImages && (
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
            renderItem={({item}) => (
              <FastImage
                source={{uri: item}}
                style={{width: width, height: width}}
                resizeMode={FastImage.resizeMode.contain}
              />
            )}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
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
});

export default ChatDetails;
