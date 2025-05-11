import React from 'react';
import NewItemForm from '../src/components/NewItemForm';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';

const NewItemScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  return (
      <NewItemForm setVisible={() => {
        navigation.goBack();
      }}  fullScreen={true}/>
  );
};

export default NewItemScreen;
