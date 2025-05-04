import React, { memo } from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import Markdown from 'react-native-markdown-display';
import _ from 'lodash';
import {colors} from '../theme/theme';
import CustomText from './common/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MessageProps } from './types';


const Message = memo(({
  item: messageItem,
  theme,
  user,
  setSelectedImages,
  setShowImageCarousel,
  handleMessageLink,
}: MessageProps) => {
  const link = _.get(messageItem, 'metadata.link', {});

  return (
    <View key={messageItem.id}>
      <View
        style={[
          styles.message,
          messageItem.sender.id === user?.id
            ? styles.myMessage
            : styles.theirMessage,
        ]}>
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor:
                messageItem.sender.id === user?.id
                  ? theme.colors.primary
                  : theme.colors.background,
            },
          ]}>
          {messageItem.media && messageItem.media.length > 0 && (
            <View
              style={{
                overflow: 'hidden',
                borderRadius: 10,
                marginTop: 10,
              }}>
              <View style={{width: 250, height: 250}}>
                {messageItem.media.length <= 3 ? (
                  messageItem.media.map((image: any, messageItemIndex: number) => (
                    <TouchableOpacity
                      key={messageItemIndex}
                      onPress={() => {
                        setSelectedImages(messageItem.media);
                        setShowImageCarousel(true);
                      }}>
                      <FastImage
                        source={{uri: image.uri}}
                        style={[styles.messageImage, {marginBottom: 5}]}
                        resizeMode={FastImage.resizeMode.cover}
                        onLoadStart={() => <View style={styles.messageImage} />}
                      />
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {messageItem.media
                      .slice(0, 4)
                      .map((image: any, messageItemIndex: number) => (
                        <TouchableOpacity
                          key={messageItemIndex}
                          onPress={() => {
                            setSelectedImages(messageItem.media);
                            setShowImageCarousel(true);
                          }}>
                          <FastImage
                            source={{uri: image.uri}}
                            style={{
                              width: 120,
                              height: 120,
                              borderRadius: 10,
                              margin: 2,
                            }}
                            resizeMode={FastImage.resizeMode.cover}
                          />
                          {messageItemIndex === 3 &&
                            messageItem.media.length > 4 && (
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
                color:
                  messageItem.sender.id === user?.id
                    ? '#FFFFFF'
                    : theme.colors.text.primary,
                fontSize: 14,
                marginHorizontal: 5,
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
              },
            }}>
            {messageItem.content}
          </Markdown>
          {link.screen && link.params && (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 15,
                borderRadius: 10,
                gap: 5,
                backgroundColor:
                  messageItem.sender.id !== user?.id
                    ? theme.colors.primary
                    : theme.colors.background,
              }}
              onPress={() => {
                handleMessageLink(link);
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color:
                    messageItem.sender.id !== user?.id
                      ? colors.white
                      : theme.colors.primary,
                }}>
                Open Link
              </Text>
              <Icon
                name="external-link"
                size={15}
                color={
                  messageItem.sender.id !== user?.id
                    ? colors.white
                    : theme.colors.primary
                }
              />
            </TouchableOpacity>
          )}
          <CustomText
            variant="h5"
            style={[
              styles.timestamp,
              {
                color:
                  messageItem.sender.id === user?.id
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
    </View>
  );
}, (prevProps, nextProps) => {
  return prevProps.item.id === nextProps.item.id &&
         prevProps.theme === nextProps.theme;
});

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
    paddingHorizontal: 10,
    borderRadius: 15,
    marginBottom: 8,
  },
  myMessage: {
    alignSelf: 'flex-end',
  },
  theirMessage: {
    alignSelf: 'flex-start',
  },
  timestamp: {
    marginVertical: 4,
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

export default Message;
