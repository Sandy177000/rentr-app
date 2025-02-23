import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useLayoutEffect, useState} from 'react';
import CustomText from './CustomText';
import {ScrollView} from 'react-native-gesture-handler';
import {itemApi} from '../apis/item';
import ListItem from './ListItem';
import { useNavigation } from '@react-navigation/native';

const ItemCard = ({title, price, theme, images}) => (
  <View style={[styles.itemCard, {backgroundColor: theme.colors.background}]}>
    <Image
      source={{uri: images?.[0] || 'https://via.placeholder.com/150'}}
      style={styles.itemImage}
      resizeMode="cover"
    />
    <CustomText style={[styles.itemTitle, {color: theme.colors.text.primary}]}>
      {title}
    </CustomText>
    <CustomText
      style={[styles.itemPrice, {color: theme.colors.text.secondary}]}>
      {price}
    </CustomText>
  </View>
);

const RecentItems = ({theme, type, title, limit}) => {
  const [recentItems, setRecentItems] = useState([]);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    switch(type){
      case 'listings':
        const fetchRecentItems = async () => {
          const listings = await itemApi.getUserItems();
          setRecentItems(listings.slice(0, limit));
        };
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
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    marginLeft: 5,
  },
  recentItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 10,
  },
  itemCard: {
    width: 120,
    marginRight: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: '100%',
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemImagePlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemTitle: {
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    color: '#666',
  },
});
export default RecentItems;
