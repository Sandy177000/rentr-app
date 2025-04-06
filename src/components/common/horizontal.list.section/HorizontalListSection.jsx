/* eslint-disable react-native/no-inline-styles */
import {View, FlatList} from 'react-native';
import React from 'react';
import CustomText from '../../../components/common/CustomText';
import {useTheme} from '../../../theme/ThemeProvider';

export const HorizontalListSection = ({title, data, renderItem}) => {
  const theme = useTheme();
  return (
    <>
      {data.length > 0 && (
        <View
          style={{
            padding: 10,
            borderRadius: 30,
            marginBottom: 8,
          }}>
          {title && (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 8,
              }}>
              <CustomText
                style={{color: theme.colors.text.primary, marginLeft: 10}}
                variant="h4"
                bold={700}>
                {title?.toUpperCase()}
              </CustomText>
            </View>
          )}
          <View
            style={{
              borderRadius: 30,
              overflow: 'hidden',
              flexDirection: 'row',
            }}>
            <FlatList
              horizontal
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              ItemSeparatorComponent={() => <View style={{width: 10}} />}
              contentContainerStyle={{paddingHorizontal: 10, marginBottom: 2}}
            />
          </View>
        </View>
      )}
    </>
  );
};
