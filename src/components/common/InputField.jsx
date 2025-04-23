import React from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../../theme/theme';
import { getTextStyle } from '../../utils/utils';
import { useTheme } from '../../theme/ThemeProvider';

const InputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  secure = false,
  toggleSecure,
}) => {
  const theme = useTheme();

  return (
    <View style={{gap: 5}}>
      {label && (
        <View style={{flexDirection: 'row'}}>
        <Text style={[getTextStyle('h4'), {color: theme.colors.text.primary}]}>
          {label}
        </Text>
        {required && (
          <Text style={[getTextStyle('h4'), {color: theme.colors.error}]}>
            *
          </Text>
        )}
      </View>
    )}
    <View
      style={[styles.inputContainer, {backgroundColor: theme.colors.surface}]}>
      <TextInput
        style={[styles.input, {color: theme.colors.text.primary}]}
        value={value}
        multiline={false}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secure}
        placeholderTextColor={colors.gray}
      />
      {toggleSecure && (
        <TouchableOpacity onPress={toggleSecure}>
          <Icon
            name={secure ? 'eye' : 'eye-slash'}
            size={20}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  </View>);
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      padding: 10,
      borderRadius: 15,
    },
    contentContainer: {
      flex: 1,
      padding: 25,
      justifyContent: 'center',
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 24,
    },
    errorText: {
      marginBottom: 16,
      textAlign: 'center',
    },
    input: {
      flex: 1,
      fontSize: 13,
      borderRadius: 15,
    },
    button: {
      borderRadius: 30,
      flexDirection: 'row',
    },
  });

export default InputField;
