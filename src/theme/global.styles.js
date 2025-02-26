import {StyleSheet} from 'react-native';

const globalStyles = StyleSheet.create({
  shadow: {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  borderRadius: {
    borderRadius: 10,
  },
});

export default globalStyles;
