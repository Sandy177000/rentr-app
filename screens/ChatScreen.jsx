import React, {useState, useEffect} from 'react';
import {View, TextInput, FlatList, StyleSheet} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import CustomText from '../src/components/common/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import {chatApi} from '../src/services/api/index';
import {useSelector} from 'react-redux';
import ChatItem from '../src/components/ChatItem';
import {selectCurrentToken, selectCurrentUser} from '../store/authSlice';
import ScreenHeader from '../src/components/ScreenHeader';
import EmptyListComponent from '../src/components/EmptyListComponent';
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

  const filteredChats =
    user && chatRooms.length > 0
      ? chatRooms?.filter(room =>
          room.participants.some(
            participant =>
              participant.user.id !== user.id &&
              participant.user.firstName
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
          ),
        )
      : [];

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <ScreenHeader title="Chats">
        <View
          style={{
            height: 45,
            borderRadius: 30,
            backgroundColor: theme.colors.surface,
            paddingHorizontal: 10,
            marginRight: 15,
          }}>
          <TextInput
            style={[styles.searchInput, {color: theme.colors.text.primary}]}
            placeholder="Search chats..."
            placeholderTextColor={theme.colors.text.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </ScreenHeader>

      <FlatList
        data={filteredChats}
        onRefresh={fetchChats}
        refreshing={loading}
        renderItem={({item, index}) => (
          <ChatItem item={item} token={token} key={item.id} />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        ListEmptyComponent={
          <EmptyListComponent>
            {!loading && filteredChats.length === 0 && <View style={styles.emptyContainer}>
              <Icon
                name="comments-o"
                size={50}
                color={theme.colors.text.secondary}
              />
              <CustomText
                variant="h4"
                style={[
                  styles.emptyText,
                  {color: theme.colors.text.secondary},
                ]}>
                No chats found
              </CustomText>
            </View>}
          </EmptyListComponent>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    width: 170,
  },
  chatList: {
    flex: 1,
    gap: 10,
  },
  emptyContainer: {
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  emptyText: {
    marginTop: 10,
  },
});

export default ChatScreen;
