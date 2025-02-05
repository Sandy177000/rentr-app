import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, SafeAreaView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useTheme } from '../src/theme/ThemeProvider'
import Icon from 'react-native-vector-icons/FontAwesome'
import CustomText from '../src/components/CustomText'

const ChatDetails = ({ route, navigation }) => {
  const theme = useTheme()
  const {chat} = route.params
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi, is this still available?', sender: 'me', timestamp: '10:00 AM' },
    { id: '2', text: 'Yes, it is!', sender: 'them', timestamp: '10:01 AM' },
  ])

  useEffect(() => {
    // Set the navigation header title to the chat recipient's name
    navigation.setOptions({
      title: chat?.name || 'Chat',
    })
  }, [navigation, chat])

  const sendMessage = () => {
    if (message.trim().length > 0) {
      setMessages([...messages, {
        id: Date.now().toString(),
        text: message,
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }])
      setMessage('')
    }
  }

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'me' ? styles.myMessage : styles.theirMessage,
      { backgroundColor: item.sender === 'me' ? theme.colors.primary : theme.colors.surface }
    ]}>
      <CustomText style={[
        styles.messageText,
        { color: item.sender === 'me' ? '#FFFFFF' : theme.colors.text.primary }
      ]}>
        {item.text}
      </CustomText>
      <CustomText style={[
        styles.timestamp,
        { color: item.sender === 'me' ? 'rgba(255, 255, 255, 0.7)' : theme.colors.text.secondary }
      ]}>
        {item.timestamp}
      </CustomText>
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        inverted={false}
      />
      <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
        <TextInput
          style={[styles.input, { 
            backgroundColor: theme.colors.background,
            color: theme.colors.text.primary 
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
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
})

export default ChatDetails