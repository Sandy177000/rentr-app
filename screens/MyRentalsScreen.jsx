import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../src/theme/ThemeProvider';
import TwoColumnListView from '../src/components/TwoColumnListView';
import ScreenHeader from '../src/components/ScreenHeader';


const MyRentalsScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [rentalsData, setRentalsData] = useState([]);

  const fetchRentals = async () => {
    setLoading(true);
    // const rentals = await getRentals();
    setRentalsData([]);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title={'My Rentals'}
        goBack={false}
      />
      <TwoColumnListView
        loading={loading}
        items={[]}
        theme={theme}
        navigation={navigation}
        onRefresh={() => {
          setLoading(true);
          fetchRentals();
          setLoading(false);
        }}
        emptyText="No rentals found"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MyRentalsScreen;
