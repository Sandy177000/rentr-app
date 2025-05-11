import React from 'react';
import {StyleSheet, View} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import CustomText from '../common/CustomText';
import CustomButton from '../common/CustomButton';

type ProfileSectionProps = {
  title: string;
  icon: string;
  onPress: () => void;
  theme: any;
};

export const ProfileSection = ({title, icon, onPress, theme}: ProfileSectionProps) => (
  <CustomButton
    style={[styles.sectionContainer, {backgroundColor: theme.colors.surface}]}
    onPress={onPress}>
      <Icons name={icon} size={20} color={theme.colors.text.primary} />
      <CustomText variant="h4" style={{color: theme.colors.text.primary}}>{title}</CustomText>

  </CustomButton>
);

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    width: 100,
    height: 100,
    borderRadius: 20,
    gap: 10,
  },
});
