import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import CustomText from '../src/components/CustomText';
export const AboutScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CustomText style={styles.title}>About</CustomText>
      <CustomText>This is a sample app built with React Native.</CustomText>
      <Button title="Go to Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AboutScreen; 