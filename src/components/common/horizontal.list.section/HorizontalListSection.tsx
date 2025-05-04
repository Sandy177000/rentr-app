/* eslint-disable react-native/no-inline-styles */
import {View, FlatList, ViewStyle} from 'react-native';
import React from 'react';
import CustomText from '../CustomText';
import {useTheme} from '../../../theme/ThemeProvider';
import ListItemSeparator from '../../ListItemSeparator';

type HorizontalListSectionProps = {
  title?: string;
  data: any[];
  renderItem: any;
  style?: ViewStyle;
};

export const HorizontalListSection = ({title, data, renderItem, style}: HorizontalListSectionProps) => {
  const theme = useTheme();
  return (  
    <>
      {data.length > 0 && (
        <View
          style={{
            padding: 10,
            borderRadius: 30,
            ...style,
          }}>
          {title && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 10,
              }}>
              <CustomText
                style={{color: theme.colors.text.primary}}
                variant="h1"
                bold={700}>
                {title}
              </CustomText>
            </View>
          )}
          <View
            style={{
              borderRadius: 30,
              flexDirection: 'row',
              overflow: 'hidden',
            }}>
            <FlatList
              horizontal
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={ListItemSeparator}
              contentContainerStyle={{paddingHorizontal: 10, marginBottom: 2}}
            />
          </View>
        </View>
      )}
    </>
  );
};
