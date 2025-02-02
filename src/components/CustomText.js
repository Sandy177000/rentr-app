import { Text } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

const CustomText = ({ style, ...props }) => {
  const theme = useTheme();
  return <Text {...props} style={[{ fontFamily: theme.font }, style]}  />;
};

export default CustomText; 