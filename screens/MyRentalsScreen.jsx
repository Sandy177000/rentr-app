import React, { useState } from 'react';
import {View, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTheme} from '../src/theme/ThemeProvider';;
import TwoColumnListView from '../src/components/TwoColumnListView';


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
      <TwoColumnListView
        loading={loading}
        items={[]}
        theme={theme}
        navigation={navigation}
        onRefresh={()=>{
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginTop: 10,
  },
  item: {
    padding: 15,
    backgroundColor: '#f9c2ff',
    marginVertical: 8,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  listContent: {
    flex: 1,
    padding: 16,
    paddingBottom: 100, // Space for the add button
  },
  row: {
    justifyContent: 'flex-start',
    marginBottom: 16,
  },
});

export default MyRentalsScreen;
