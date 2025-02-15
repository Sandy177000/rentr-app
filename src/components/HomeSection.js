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
        ItemSeparatorComponent={() => <View style={{width: 10}} />}
        contentContainerStyle={{paddingHorizontal: 4, marginBottom: 2}}
      />
    </View>
  );
};

export default HomeSection;
