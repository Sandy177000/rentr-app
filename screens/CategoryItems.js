import { View, Text } from 'react-native'
import React from 'react'

const CategoryItems = ({ route }) => {
  const { category } = route.params;
  return (
    <View>
      <Text>{category}</Text>
    </View>
  )
}

export default CategoryItems