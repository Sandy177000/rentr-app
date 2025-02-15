import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../theme/ThemeProvider';
import {avatar} from '../constants';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice';

const ChatItem = ({item, token, index}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const user = useSelector(selectCurrentUser);
  const participants = user ? item.participants.filter(
    participant => participant.user.id !== user.id,
  ) : [];

  return (
    <TouchableOpacity
      key={item.id}
      style={[styles.chatItem, {backgroundColor: theme.colors.surface}]}
      onPress={() =>
        navigation.navigate('ChatDetails', {
          chat: item,
          roomId: item.id,
          token: token,
        })
      }>
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          {participants.map(participant => (
            <View style={styles.avatar}>
              <Image
                source={{uri: participant.user.profileImage || avatar}}
                style={styles.avatar}
              />
            </View>
          ))}
          {participants.map(participant => (
            <CustomText
              style={[styles.chatName, {color: theme.colors.text.primary}]}>
              {participant.user.firstName}
            </CustomText>
          ))}
          <CustomText
            style={[styles.chatTime, {color: theme.colors.text.secondary}]}>
            {item.time}
          </CustomText>
        </View>
        {/* <View style={styles.chatFooter}>
          <CustomText
            style={[styles.lastMessage, {color: theme.colors.text.secondary}]}
            numberOfLines={1}>
            {"item.lastMessage"}
          </CustomText>
          {item.unread > 0 && (
            <View
              style={[
                styles.unreadBadge,
                {backgroundColor: theme.colors.primary},
              ]}>
              <CustomText style={styles.unreadText}>{item.unread}</CustomText>
            </View>
          )}
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  chatName: {
    fontWeight: 'bold',
  },
  chatTime: {
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
  },
  unreadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  unreadText: {
    color: 'white',
  },
});

export default ChatItem;
