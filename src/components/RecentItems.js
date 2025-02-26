import {View, Text, StyleSheet, Image, ActivityIndicator} from 'react-native';
import React, {useEffect, useLayoutEffect, useState} from 'react';
import CustomText from './common/CustomText';
import {ScrollView} from 'react-native-gesture-handler';
import {itemApi} from '../apis/item';
import ListItem from './ListItem';
import { useNavigation } from '@react-navigation/native';

const RecentItems = ({theme, type, title, limit}) => {
  const [recentItems, setRecentItems] = useState([]);
  const navigation = useNavigation();


  const fetchRecentItems = async () => {
    try {
      const listings = await itemApi.getUserItems();
      setRecentItems(listings.slice(0, limit));
    } catch (error) {
      console.error('Error fetching recent items:', error);
    }
  };

  useEffect(() => {
    switch(type){
      case 'listings':
        fetchRecentItems();
        break;
      case 'rentals':
        break;
    }
  }, [limit, type]);

  return (
    <>
    {recentItems.length > 0 && (<View style={styles.recentSection}>
      <CustomText
        bold={600}
        variant="h4"
        style={[styles.recentTitle, {color: theme.colors.text.primary}]}>
        {title}
      </CustomText>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={styles.recentItemsContainer}>
          {recentItems.map((item, index) => (
            <ListItem
              key={item.id}
              item={item}
              theme={theme}
              index={index}
              navigation={navigation}
            />
          ))}
          </View>
          </ScrollView>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  recentSection: {
    marginTop: 20,
  },
  recentTitle: {
    marginBottom: 10,
    marginLeft: 5,
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
  }
});
export default RecentItems;
