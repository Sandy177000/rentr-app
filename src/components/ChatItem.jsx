import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import CustomText from './common/CustomText';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../theme/ThemeProvider';
import {avatar} from '../constants';
import {useSelector} from 'react-redux';
import {selectCurrentUser} from '../../store/authSlice';
import CustomImage from './common/CustomImage';

const ChatItem = ({item, token, index}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const user = useSelector(selectCurrentUser);
  const participants = user
    ? item.participants.filter(participant => participant.user.id !== user.id)
    : [];

  return (
    <TouchableOpacity
      style={[styles.chatItem, {backgroundColor: theme.colors.surface}]}
      onPress={() =>
        navigation.navigate('ChatDetails', {
          chat: item,
          roomId: item.id,
          token: token,
          profileImage: participants[0]?.user?.profileImage,
        })
      }>
      <View style={styles.chatContent} key={index}>
        <View style={styles.chatHeader}>
          {participants.map(participant => (
            <View style={styles.avatar} key={`${participant.user.id}-image`}>
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
              key={`${participant.user.id}-name`}
              variant="h3"
              style={{
                color: theme.colors.text.primary,
                fontWeight: 'bold',
                marginTop: 5,
              }}>
              {participant.user.firstName}
            </CustomText>
          ))}
          <CustomText
            variant="body"
            style={{color: theme.colors.text.secondary}}
            numberOfLines={1}>
            {item.messages[0]?.content.length > 50
              ? item.messages[0]?.content.slice(0, 50) + '...'
              : item.messages[0]?.content}
          </CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chatItem: {
    padding: 15,
    borderRadius: 20,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 25,
  },
  chatContent: {
    flexDirection: 'row',
  },
  chatHeader: {},
  chatName: {
    fontWeight: 'bold',
  },
  chatFooter: {
    marginLeft: 13,
    flex: 1,
    alignItems: 'flex-start',
    top: -5,
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
