import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
  Animated,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useTheme} from '../src/theme/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomText from '../src/components/CustomText';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '../store/authSlice';
import {chatApi} from '../src/apis/chat';
import io from 'socket.io-client';
import {getBaseUrl} from '../src/apis/constants';
import {avatar} from '../src/constants';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

const ChatDetails = ({route, navigation}) => {
  const theme = useTheme();
  const {chat, roomId, token} = route.params;
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectCurrentUser);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const flatListRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const modalHeight = useRef(new Animated.Value(0)).current;
  const [media, setMedia] = useState([]);

  useEffect(() => {
    const title = chat?.participants
      ?.filter(participant => participant.user.id !== user.id)
      .map(participant => participant.user.firstName)
      .join(', ');
    navigation.setOptions({
      title: title,
    });
  }, [navigation, chat, roomId, user.id]);

  // Initialize socket connection
  useEffect(() => {
    const baseUrl = getBaseUrl();
    const newSocket = io(baseUrl, {
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

  const sendMessage = async () => {
    try{
    if (message.trim().length > 0) {
      // Emit message to socket server
      const data = new FormData();
      media.forEach((item, index) => {
        data.append('images', {
          uri: item.uri,
          type: item.type || 'image/jpeg',
          name: `${user.id}_image_${index}.jpg`,
        });
      });
      data.append('content', message);
      data.append('roomId', roomId);
      // TODO: rethink this approach 
      // sending message to backend and then socket is emitting the message
      await chatApi.sendMessage(data);
      setMessage('');
      setMedia([]);
    }
    } catch (error) {
      console.log(error);
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

  const renderMessage = ({item}) => (
    <View
      style={[
        styles.message,
        item.sender.id === user.id ? styles.myMessage : styles.theirMessage,
      ]}>
      {item.sender.id !== user.id && (
        <Image
          source={{uri: item.sender.profileImage || avatar}}
          style={styles.avatar}
        />
      )}
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
        {item.sender.id !== user.id && (
          <CustomText style={[{color: theme.colors.text.primary}]}>
            {item.sender.firstName}
          </CustomText>
        )}
        {item.media && item.media.length > 0 && (
          <View style={{flexDirection:'column', gap:8}}>
            {item.media.map((image, index) => (
              <View key={index} style={{borderRadius:1, borderColor:'white', width: 100, height:100}}>
                <Image source={{uri: image}} style={styles.previewImage} />
              </View>
          ))}
          </View>

        )}
        <CustomText
          style={[
            styles.messageText,
            {
              color:
                item.sender.id === user.id
                  ? '#FFFFFF'
                  : theme.colors.text.primary,
            },
          ]}>
          {item.content}
        </CustomText>
        <CustomText
          style={[
            styles.timestamp,
            {
              color:
                item.sender.id === user.id
                  ? 'rgba(255, 255, 255, 0.7)'
                  : theme.colors.text.secondary,
            },
            item.sender.id === user.id ? styles.myMessage : styles.theirMessage,
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

  // Add this function to scroll to the bottom
  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({animated: true, scrollTo: 'bottom'});
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
          onContentSizeChange={scrollToBottom} // Scroll when content size changes
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
          {media.length > 0  && (
            <View style={styles.imageSection}>
              <ScrollView
                style={styles.imagePreviewContainer}
                showsHorizontalScrollIndicator={false}
                horizontal={true}>
                {media.map((image, index) => (
                  <View key={index} style={styles.imagePreview}>
                    <Image
                      source={{uri: image.uri}}
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
              style={[styles.button, {backgroundColor: theme.colors.primary}]}
              onPress={handleModal}>
              <Icon
                name={showModal ? 'close' : 'plus'}
                size={15}
                color={'#FFFFFF'}
              />
            </TouchableOpacity>
            <TextInput
              style={{flex: 1, marginLeft: 5}}
              value={message}
              onChangeText={setMessage}
              placeholder="Message..."
              placeholderTextColor={theme.colors.text.secondary}
              multiline
            />
            <TouchableOpacity
              onPress={sendMessage}
              style={[styles.button, { backgroundColor: theme.colors.primary}]}
              disabled={message.trim().length === 0}>
              <Icon name="send" size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 6,
    borderRadius: 30,
    margin: 8,
    width: '95%',
    maxHeight: 100,
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
    marginHorizontal: 11,
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
  }
});

export default ChatDetails;
