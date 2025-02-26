import { StyleSheet, TouchableOpacity, View } from 'react-native'
import React from 'react'
import CustomText from './common/CustomText';
import Icons from 'react-native-vector-icons/FontAwesome';

const ProfileSection = ({title, icon, onPress, theme}) => (
    <TouchableOpacity
      style={[
        styles.sectionContainer,
        {backgroundColor: theme.colors.background},
      ]}
      onPress={onPress}>
      <View style={styles.sectionContent}>
        <Icons name={icon} size={18} color={theme.colors.text.primary} />
        <CustomText style={[styles.sectionTitle, {color: theme.colors.text.primary}]}>
          {title}
        </CustomText>
      </View>
      <Icons
        name="chevron-right"
        size={14}
        color={theme.colors.text.secondary}
      />
    </TouchableOpacity>
  );

const styles = StyleSheet.create({  
    sectionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    sectionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionTitle: {
        marginLeft: 10,
    },
});

export default ProfileSection;