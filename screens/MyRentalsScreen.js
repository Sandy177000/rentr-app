import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../src/theme/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Item } from '../components/Item';

// Sample data for rentals
const rentalsData = [
    { id: '1', name: 'Rental 1' },
    { id: '2', name: 'Rental 2' },
    { id: '3', name: 'Rental 3' },
];

const MyRentalsScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();

    const renderItem = ({ item }) => (
        <Item item={item} navigation={navigation} theme={theme} />
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={rentalsData}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
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
});

export default MyRentalsScreen;
