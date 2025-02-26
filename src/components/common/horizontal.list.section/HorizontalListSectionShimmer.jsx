import {View, FlatList} from 'react-native';
import React from 'react';
import {useTheme} from '../../../theme/ThemeProvider';
import createShimmerPlaceholder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export const HorizontalListSectionShimmer = () => {
  const theme = useTheme();
  
  const shimmerData = Array(5).fill({id: Math.random().toString()});

  const renderShimmerItem = () => (
    <View style={{width: 150, height: 200}}>
      <ShimmerPlaceholder
        style={{width: '100%', height: '100%', borderRadius: 8}}
        shimmerColors={[
          theme.colors.shimmer.start,
          theme.colors.shimmer.middle,
          theme.colors.shimmer.end,
        ]}
      />
    </View>
  );

  return (
    <View style={{padding: 8, borderRadius: 12, marginBottom: 8}}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 8,
        }}>
        <ShimmerPlaceholder
          style={{width: 120, height: 20, borderRadius: 4, marginLeft: 10}}
          shimmerColors={[
            theme.colors.shimmer.start,
            theme.colors.shimmer.middle,
            theme.colors.shimmer.end,
          ]}
        />
      </View>
      <FlatList
        horizontal
        data={shimmerData}
        renderItem={renderShimmerItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{width: 10}} />}
        contentContainerStyle={{paddingHorizontal: 4, marginBottom: 2}}
      />
    </View>
  );
}; 