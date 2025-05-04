import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Dimensions} from 'react-native';
import {itemApi} from '../src/services/api/index';
import {useTheme} from '../src/theme/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import CustomText from '../src/components/common/CustomText';
import TwoColumnListView from '../src/components/TwoColumnListView';
import CustomModal from '../src/components/common/CustomModal';
import NewItemForm from '../src/components/NewItemForm';
import ScreenHeader from '../src/components/ScreenHeader';

const {width} = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

export const MyListingsScreen = () => {
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();
  const [visible, setVisible] = useState(false);

  const fetchListings = async () => {
    setLoading(true);
    const listings = await itemApi.getUserItems();
    setMyListings(listings);
    setLoading(false);
  };
  useEffect(() => {
    fetchListings();
  }, []);

  return (
    <>
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <ScreenHeader title="My Items" />
        <TwoColumnListView
          loading={loading}
          items={myListings}
          theme={theme}
          navigation={navigation}
          onRefresh={fetchListings}
          emptyText="No listings found"
          showFavorite={false}
        />
        {
          <TouchableOpacity
            style={[
              styles.addButton,
              {backgroundColor: theme.colors.primary, zIndex: 2},
            ]}
            onPress={() => setVisible(!visible)}>
            <Icon name="plus" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        }
      </View>
      {visible && (
        <CustomModal showModal={visible} setShowModal={setVisible}>
          <NewItemForm setVisible={setVisible} />
        </CustomModal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 3
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  itemCard: {
    width: COLUMN_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  itemContent: {
    padding: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    marginBottom: 12,
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    width: 60,
    height: 60,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 16,
  },
});
