import React from 'react';
import {View} from 'react-native';
import {Message} from './types';
import CustomText from './common/CustomText';
import {StyleSheet} from 'react-native';
import {useTheme} from '../theme/ThemeProvider';

type DateSeparatorProps = {
  currentMessage: Message;
  previousMessage: Message;
  index: number;
};
const DateSeparator = ({
  currentMessage,
  previousMessage,
  index,
}: DateSeparatorProps) => {
  const theme = useTheme();
  if (!currentMessage) {
    return null;
  }

  if (index === 0) {
    const currentDate = new Date(currentMessage.createdAt);
    return (
      <View
        style={[
          styles.dateSeparator,
          {backgroundColor: theme.colors.background + '80'},
        ]}>
        <CustomText style={styles.dateSeparatorText}>
          {currentDate.toLocaleDateString('en-IN', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </CustomText>
      </View>
    );
  }
  const previousDate =
    index > 0 && previousMessage ? new Date(previousMessage.createdAt) : null;
    const currentDate = new Date(currentMessage.createdAt);


  if (
    previousDate &&
    currentDate.toDateString() !== previousDate.toDateString()
  ) {
    return (
      <View
        style={[
          styles.dateSeparator,
          {backgroundColor: theme.colors.background + '80'},
        ]}>
        <CustomText style={styles.dateSeparatorText}>
          {currentDate.toLocaleDateString('en-IN', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </CustomText>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  dateSeparator: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    alignSelf: 'center',
    borderRadius: 30,
    marginVertical: 10,
  },
  dateSeparatorText: {
    fontSize: 12,
    color: 'gray',
  },
});

export default DateSeparator;
