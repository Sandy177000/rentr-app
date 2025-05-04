import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import CustomText from './common/CustomText';
import ListItem from './ListItem';
import {useNavigation} from '@react-navigation/native';
import {HorizontalListSection} from './common/horizontal.list.section/HorizontalListSection';
import {itemApi} from '../services/api/index';


const RecentItems = ({theme, type, title, limit, loading}) => {
  const [recentItems, setRecentItems] = useState([]);
  const navigation = useNavigation();

  const fetchRecentItems = useCallback(async () => {
    try {
      const listings = await itemApi.getUserItems();
      setRecentItems(listings.slice(0, limit));
    } catch (error) {
      console.error('Error fetching recent items:', error);
    }
  }, [limit]);

  useEffect(() => {
    switch (type) {
      case 'listings':
        fetchRecentItems();
        break;
      case 'rentals':
        break;
    }
  }, [fetchRecentItems, type, loading]);

  return (
    <>
      {recentItems.length > 0 && (
        <View style={styles.recentSection}>
          <CustomText
            bold={600}
            variant="h2"
            style={[{color: theme.colors.text.primary, paddingHorizontal: 30}]}>
            {title}
          </CustomText>
          <HorizontalListSection
            data={recentItems}
            renderItem={({item, index}) => {
              return (
                <ListItem
                  key={item.id}
                  item={item}
                  theme={theme}
                  index={index}
                  navigation={navigation}
                />
              );
            }}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  recentSection: {
    marginTop: 20,
  },
  recentItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
});
export default RecentItems;
