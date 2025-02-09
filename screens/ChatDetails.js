import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTheme } from '../src/theme/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import CustomText from '../src/components/CustomText';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';
import { chatApi } from '../src/apis/chat';
import io from 'socket.io-client';
import { getBaseUrl } from '../src/apis/constants';
import { avatar } from '../src/constants';

const ChatDetails = ({ route, navigation }) => {
  const theme = useTheme();
  const {chat, roomId, token} = route.params;
  const user = useSelector(selectCurrentUser);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Set the navigation header title to the chat recipient's name
    const title = chat?.participants?.filter(participant => participant.user.id !== user.id).map(participant => participant.user.firstName).join(', ');
    navigation.setOptions({
      title: title,
    });
  }, [navigation, chat, roomId, user.id]);

  // Initialize socket connection
  useEffect(() => {
    const baseUrl = 'http://192.168.1.44:4000';
    const newSocket = io(baseUrl, {
      auth: {
        token: token
      }
    });
  
    // Remove the emit('connection') - Socket.IO handles this automatically
    newSocket.on('connect', () => {
      console.log("Connected to socket");
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

    socket.on('new_message', (newMessage) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('new_message');
    };
  }, [socket]);

  const sendMessage = async () => {
    if (message.trim().length > 0) {
      // Emit message to socket server
      socket.emit('send_message', {
        content: message,
        roomId: roomId
      });
      setMessage('');
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await chatApi.getChatMessages(roomId);
      setMessages(messages);
    };
    fetchMessages();
  }, [roomId]);

  const renderMessage = ({ item }) => (
    <View style={[
      styles.message,
      item.sender.id === user.id ? styles.myMessage : styles.theirMessage,
    ]}>
       {item.sender.id !== user.id && <Image source={{ uri: item.sender.profileImage || avatar }} style={styles.avatar} />}
      <View style={[
        styles.messageBubble,
      { backgroundColor: item.sender.id === user.id ? theme.colors.primary : theme.colors.surface },
    ]}>
      {item.sender.id !== user.id && <CustomText style={[
        { color: item.sender.id === user.id ? '#FFFFFF' : theme.colors.text.primary },
      ]}>
        {item.sender.firstName}
      </CustomText>}
      <CustomText style={[
        styles.messageText,
        { color: item.sender.id === user.id ? '#FFFFFF' : theme.colors.text.primary },
      ]}>
        {item.content}
      </CustomText>
      <CustomText style={[
        styles.timestamp,
        { color: item.sender.id === user.id ? 'rgba(255, 255, 255, 0.7)' : theme.colors.text.secondary },
        item.sender.id === user.id ? styles.myMessage : styles.theirMessage,
      ]}>
        {item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
      </CustomText>
      </View>
    </View>
  );

  // Add this function to scroll to the bottom
  const scrollToBottom = useCallback(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true, scrollTo: 'bottom' });
    }
  }, [messages]);

  // Add this effect to scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        ref={flatListRef}
        style={{backgroundColor: theme.colors.surface}}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        inverted={false}
        ListEmptyComponent={<CustomText>No messages yet</CustomText>}
        onContentSizeChange={scrollToBottom} // Scroll when content size changes
        onLayout={scrollToBottom} // Scroll on initial layout
      />
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
        <TextInput
          style={[styles.input, {
            backgroundColor: theme.colors.background,
            color: theme.colors.text.primary,
          }]}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={theme.colors.text.secondary}
          multiline
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
          disabled={message.trim().length === 0}
        >
          <Icon name="send" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  messageList: {
    padding: 16,
  },
  message:{
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
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ChatDetails;
