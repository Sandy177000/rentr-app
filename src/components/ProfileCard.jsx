import React, {useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
  Linking,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {useDispatch} from 'react-redux';
import {updateUser} from '../../store/authSlice';
import {userApi} from '../services/api/index';
import CustomText from './common/CustomText';
import {avatar} from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors} from '../theme/theme';
import {isIOS} from '../utils/utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const ProfileCard = ({user, theme, navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleUpdateProfileImage = async source => {
    const options = {
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 1200,
      saveToPhotos: true,
    };
    setModalVisible(false);

    try {
      let response;
      if (source === 'gallery') {
        response = await launchImageLibrary(options);
      } else if (source === 'camera') {
        response = await launchCamera(options);
      }
      // Handle camera permissions
      if (response.errorCode === 'others') {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera access in your device settings.',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Open Settings',
              onPress: () => {
                if (isIOS()) {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ],
        );
        return;
      }
      if (response.didCancel) {
        return;
      }

      if (response.errorCode) {
        console.error('ImagePicker Error:', response);
        Alert.alert('Error', response.errorMessage || 'Failed to pick image');
        return;
      }
      if (response.assets && response.assets[0]) {
        setLoading(true);

        const formData = new FormData();
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('email', user.email);
        formData.append('phone', user.phone);
        formData.append('images', {
          uri: response.assets[0].uri,
          type: response.assets[0].type || 'image/jpeg',
          name: `${user.firstName}_image_0.jpg`,
        });

        const {profileImage} = await userApi.updateUserInfo(formData);
        if (profileImage) {
          dispatch(updateUser({...user, profileImage}));
        }
      }
    } catch (error) {
      console.error('Error updating profile image:', JSON.stringify(error));
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ProfilePickerModal
        handleUpdateProfileImage={handleUpdateProfileImage}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        theme={theme}
      />
      <View
        style={[
          styles.header,
          {
            backgroundColor: theme.colors.surface,
          },
        ]}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsButton}>
          <Icons name="gear" size={24} color={theme.colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.profileImageContainer} activeOpacity={1}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={theme.colors.primary}
              style={styles.profileImage}
            />
          ) : (
            <Image
              source={{uri: user.profileImage || avatar}}
              style={styles.profileImage}
            />
          )}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.editImageButton,
              {
                backgroundColor: theme.colors.primary,
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => setModalVisible(!modalVisible)}>
            <Icons name="pencil" size={14} color="white" />
          </TouchableOpacity>
        </TouchableOpacity>
        <CustomText style={{color: theme.colors.text.secondary}} variant="h1">
          {user.firstName} {user.lastName}
        </CustomText>
      </View>
    </>
  );
};

const getColor = flag => {
  return flag ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)';
};
const ProfilePickerModal = ({
  handleUpdateProfileImage,
  modalVisible,
  setModalVisible,
  theme,
}) => {
  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}>
      <View style={styles.modalBackground}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: getColor(theme.isDark),
              borderColor: getColor(!theme.isDark),
            },
          ]}>
          <TouchableOpacity
            activeOpacity={1}
            style={[
              {
                backgroundColor: theme.colors.primary,
                ...styles.closeButton,
              },
            ]}
            onPress={() => setModalVisible(false)} // Close the modal
          >
            <Icon name="close" size={20} color={colors.white} />
          </TouchableOpacity>
          <CustomText
            variant="h4"
            style={[styles.modalTitle, {color: theme.colors.text.primary}]}>
            Update Profile Picture
          </CustomText>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[
                styles.modalButton,
                {backgroundColor: theme.colors.surface},
              ]}
              onPress={() => {
                handleUpdateProfileImage('gallery');
              }}>
              <Icon name="image" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modalButton,
                {backgroundColor: theme.colors.surface},
              ]}
              onPress={() => handleUpdateProfileImage('camera')}>
              <Icon name="camera" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    elevation: 1,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 100,
    elevation: 1,
  },
  editImageButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    padding: 8,
    borderRadius: 200,
    width: 35,
    height: 35,
    borderWidth: 3,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
  },
  email: {
    color: '#666',
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    padding: 20,
    borderRadius: 30,
    width: '70%',
    position: 'relative',
    borderWidth: 0.2,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  modalButton: {
    borderRadius: 100,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  modalButtonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  modalTitle: {
    fontWeight: '900',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  closeButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    borderRadius: 100,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default ProfileCard;
