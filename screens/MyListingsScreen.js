import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';
import {itemApi} from '../src/apis/item';
import {useTheme} from '../src/theme/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import ListItem from '../src/components/ListItem';
import CustomText from '../src/components/common/CustomText';
import CustomBottomSheet from '../src/components/CustomBottomSheet';
import {ListItemForm} from '../src/components/ListItemForm';
import {BottomGradient} from '../src/components/BottomGradient';
import EmptyListComponent from '../src/components/EmptyListComponent';
const {width} = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2; // 48 = padding left + right + gap

export const MyListingsScreen = () => {
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const bottomSheetRef = useRef(null);

  const fetchListings = async () => {
    setLoading(true);
    const listings = await itemApi.getUserItems();
    setMyListings(listings);
    setLoading(false);
  };
  useEffect(() => {
    fetchListings();
  }, []);

  const renderItem = ({item, index}) => (
    <ListItem item={item} index={index} theme={theme} navigation={navigation} />
  );

  return (
    <>
      <View
        style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <FlatList
          data={myListings}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchListings} />
          }
          ListEmptyComponent={
            !loading &&
            myListings.length === 0 && (
              <EmptyListComponent>
                <Icon
                  name="inbox"
                  size={50}
                  color={theme.colors.text.secondary}
                />
                <CustomText
                  style={[
                    styles.emptyText,
                    {color: theme.colors.text.secondary},
                  ]}>
                  No listings yet
                </CustomText>
              </EmptyListComponent>
            )
          }
        />
        {!visible && (
          <TouchableOpacity
            style={[
              styles.addButton,
              {backgroundColor: theme.colors.primary, zIndex: 2},
            ]}
            onPress={() => setVisible(!visible)}>
            <Icon name="plus" size={20} color="#FFFFFF" />
            <CustomText style={styles.addButtonText}>List New Item</CustomText>
          </TouchableOpacity>
        )}
      </View>
      {visible && (
        <CustomBottomSheet
          theme={theme}
          data={myListings}
          renderItem={renderItem}
          visible={visible}
          setVisible={setVisible}
          bottomSheetRef={bottomSheetRef}
          title="List New Item"
          form={true}>
          <ListItemForm setVisible={setVisible} />
        </CustomBottomSheet>
      )}
      {/* {!visible && <BottomGradient theme={theme} zIndex={1} />} */}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
