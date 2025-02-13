import React, {useState, useEffect} from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {useTheme} from '../src/theme/ThemeProvider';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ListItem from '../src/components/ListItem';
import CustomText from '../src/components/CustomText';
import {userApi} from '../src/apis/user';


// maintain a state to quickly update the favourites list
const FavouritesScreen = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const theme = useTheme();

  const getFavourites = async () => {
    setLoading(true);

    try {
      const response = await userApi.getFavourites();
      console.log('response getFavourites', response);
      if (response.error) {
        console.log(response.error);
      } else {
        setFavourites(response);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('favourites useEffect');
    getFavourites();
    console.log('favourites useEffect after getFavourites');
  }, []);

  const renderItem = ({item, index}) => (
    <ListItem item={item} index={index} theme={theme} navigation={navigation} />
  );

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlatList
        data={favourites}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon
              name="heart-o"
              size={50}
              color={theme.colors.text.secondary}
            />
            <CustomText
              style={[styles.emptyText, {color: theme.colors.text.secondary}]}>
              No favourites yet
            </CustomText>
          </View>
        }
      />
    </View>
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
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
  },
});

export default FavouritesScreen;
