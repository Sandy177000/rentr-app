import React from 'react';
import {StyleSheet, View} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import CustomText from '../common/CustomText';
import CustomButton from '../common/CustomButton';

export const ProfileSection = ({title, icon, onPress, theme}) => (
  <CustomButton
    style={[styles.sectionContainer, {backgroundColor: theme.colors.surface}]}
    onPress={onPress}>
    <View style={styles.sectionContent}>
      <Icons name={icon} size={15} color={theme.colors.text.primary} />
      <CustomText
        variant="h4"
        style={[styles.sectionTitle, {color: theme.colors.text.secondary}]}>
        {title}
      </CustomText>
    </View>
    <Icons name="chevron-right" size={14} color={theme.colors.text.secondary} />
  </CustomButton>
);

const styles = StyleSheet.create({
  sectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 25,
    marginBottom: 10,
    borderRadius: 30,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    marginLeft: 15,
    fontWeight: 'bold',
  },
});
