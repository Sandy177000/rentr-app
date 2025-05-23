import {View, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';
import { FlatList as GestureFlatList } from 'react-native-gesture-handler';
import CustomText from './common/CustomText';
const CustomBottomSheet = ({
  theme,
  data,
  showCloseButton,
  title,
  renderItem,
  visible,
  setVisible,
  bottomSheetRef,
  children,
  enablePanDownToClose = true,
}) => {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={visible ? 0 : -1}
      enablePanDownToClose={enablePanDownToClose}
      enableFooterGestureAnimated={true}
      handleStyle={{
        backgroundColor: theme.colors.primary,
        borderRadiusTopLeft: 10,
        borderRadiusTopRight: 10,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.background,
      }}
      onChange={index => {
        if (index === -1) {
          bottomSheetRef.current?.close();
          setVisible(!visible);
        }
      }}
      >
      <BottomSheetView
        style={{
          padding: 20,
          backgroundColor: theme.colors.background,
          flex: 1,
        }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.text.secondary,
              marginBottom: 10,
              paddingBottom: 10,
            }}>
            <CustomText
              variant="h3"
              style={[
                styles.sectionTitle,
                {color: theme.colors.text.primary, alignSelf: 'center'},
              ]}>
              {title}
            </CustomText>
            {showCloseButton && (
              <TouchableOpacity
                onPress={() => {
                  setVisible(false);
                  bottomSheetRef.current?.close();
                }}>
                <CustomText style={{color: theme.colors.text.primary}}>Done</CustomText>
              </TouchableOpacity>
            )}
          </View>
          {children ? children : <GestureFlatList data={data} renderItem={renderItem}/>}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CustomBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  button: {
    padding: 10,
    borderRadius: 10,
    width: 100,
    alignItems: 'center',
  },
});
