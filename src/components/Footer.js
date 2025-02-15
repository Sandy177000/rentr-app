import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export default function Footer() {
  return (
    <View style={styles.container}>
      <Text>Made</Text>
      <Text>with</Text>
      <Text>❤️</Text>
      <Text>by</Text>
      <Text>Sandesh</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        height: 200,
        width: '100%',
        gap: 10,

    }
})