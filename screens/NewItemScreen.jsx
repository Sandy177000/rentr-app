import React from 'react';
import NewItemForm from '../src/components/NewItemForm';
import {useNavigation} from '@react-navigation/native';
import {View} from 'react-native';
import { useTheme } from '../src/theme/ThemeProvider';
import CustomText from '../src/components/common/CustomText';

const NewItemScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const handleVisibilty = () => {
    navigation.navigate('MyListings');
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        paddingVertical: 15,
        backgroundColor: theme.colors.surface
      }}>
       <CustomText variant='h2' bold={600} style={{
          marginVertical: 15
       }}>Add New Item for Rent</CustomText>
      <NewItemForm setVisible={handleVisibilty} />
    </View>
  );
};

export default NewItemScreen;
