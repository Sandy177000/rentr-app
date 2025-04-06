import {StyleSheet} from 'react-native';

const globalStyles = StyleSheet.create({
  shadow: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 10, height: 12},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  borderRadius: {
    borderRadius: 10,
  },
});

export default globalStyles;
