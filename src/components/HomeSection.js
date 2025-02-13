import {View, Text, TouchableOpacity, FlatList} from 'react-native';
import React from 'react';
import CustomText from './CustomText';
import {useTheme} from '../theme/ThemeProvider';
import Divider from './Divider';

const HomeSection = ({title, data, renderItem}) => {
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
        <CustomText style={{color: theme.colors.text.primary, marginLeft: 10}} variant="body">
          {title}
        </CustomText>
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
