import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../theme/ThemeProvider';
import {avatar} from '../constants';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice';
import { CustomImage } from './CustomImage';

const ChatItem = ({item, token, index}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const user = useSelector(selectCurrentUser);
  const participants = user ? item.participants.filter(
    participant => participant.user.id !== user.id,
  ) : [];

  return (
    <TouchableOpacity
      key={`${item.participants[0].user.id}`}
      style={[styles.chatItem, {backgroundColor: theme.colors.surface}]}
      onPress={() =>
        navigation.navigate('ChatDetails', {
          chat: item,
          roomId: item.id,
          token: token,
          profileImage: participants[0]?.user?.profileImage,
        })
      }>
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          {participants.map(participant => (
            <View style={styles.avatar}>
              <CustomImage
                source={participant.user.profileImage || avatar}
                style={styles.avatar}
                showLoading={false}
              />
            </View>
          ))}
         
        </View>
        <View style={styles.chatFooter}>
        {participants.map(participant => (
            <CustomText
              variant="h3"
              style={{color: theme.colors.text.primary, fontWeight: 'bold', marginTop: 5}}>
              {participant.user.firstName}
            </CustomText>
          ))}
          <CustomText
            variant="body"
            style={{color: theme.colors.text.secondary}}
            numberOfLines={1}
          >
            {item.messages[0].content}
          </CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    padding: 13,
    borderRadius: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  chatContent: {
    flexDirection: 'row',
  },
  chatHeader: {
  },
  chatName: {
    fontWeight: 'bold',
  },
  chatFooter: {
    marginLeft: 13,
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
