import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

// Sample data for rentals
const rentalsData = [
    { id: '1', title: 'Rental 1' },
    { id: '2', title: 'Rental 2' },
    { id: '3', title: 'Rental 3' },
];

const MyRentalsScreen = () => {
    const renderItem = ({ item }) => (
        <View style={styles.item}>
            <Text style={styles.title}>{item.title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Rentals</Text>
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
});

export default MyRentalsScreen;
