import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import {useTheme} from '../theme/ThemeProvider';
import Divider from './Divider';

const HomeSection = ({title, data, onPress, renderItem}) => {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: theme.colors.surface,
        padding: 8,
        borderRadius: 12,
        marginBottom: 8,
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 8,
        }}>
        <CustomText style={{color: theme.colors.text.primary}} variant="body">
          {title}
        </CustomText>
        <TouchableOpacity onPress={onPress}>
          <CustomText style={{color: theme.colors.text.primary}} variant="h4">
            View All
          </CustomText>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 8, marginBottom: 8}}
      />
    </View>
  );
};

export default HomeSection;
