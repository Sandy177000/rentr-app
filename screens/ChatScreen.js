import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';
import CustomText from '../src/components/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { chatApi } from '../src/apis/chat';
import { useSelector } from 'react-redux';
import ChatItem from '../src/components/ChatItem';
import { selectCurrentToken, selectCurrentUser } from '../store/authSlice';
const ChatScreen = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  useEffect(() => {
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const chatRoomsData = await chatApi.getChatRooms();
      setChatRooms(chatRoomsData);
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredChats = user && chatRooms.filter(room => room.participants.some(participant => participant.user.id !== user.id && participant.user.firstName.toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <Icon name="search" size={20} color={theme.colors.text.secondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text.primary }]}
          placeholder="Search chats..."
          placeholderTextColor={theme.colors.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredChats}
        onRefresh={fetchChats}
        refreshing={loading}
        renderItem={({ item, index }) => <ChatItem item={item} token={token} index={index}/>}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="comments-o" size={50} color={theme.colors.text.secondary} />
            <CustomText style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
              No chats found
            </CustomText>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    paddingLeft: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  chatList: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
  },
});

export default ChatScreen;
