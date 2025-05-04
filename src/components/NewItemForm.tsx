/* eslint-disable react-native/no-inline-styles */
// screens/ListItemScreen.js
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Text,
  TextInput,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { chatApi, itemApi } from '../services/api/index';
import Divider from './Divider';
import { colors } from '../theme/theme';
import Toast from 'react-native-toast-message';
import SelectDropdown from 'react-native-select-dropdown';
import { categories } from '../constants';
import { Calendar, DateData } from 'react-native-calendars';
import CustomText from './common/CustomText';
import { useNavigation } from '@react-navigation/native';
import MapViewer from './MapViewer';
import { isKeyboardVisible, handleMediaPicker } from '../utils/utils';
import { TItem, TLocation, TRootStackParamList, TFormData } from './types';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomImage from './common/CustomImage';

type NewItemFormProps = {
  setVisible: (visible: boolean) => void;
  item?: TItem;
  editing?: boolean;
  fullScreen?: boolean;
};

const NewItemForm = ({
  setVisible,
  item,
  editing = false,
  fullScreen = false,
}: NewItemFormProps) => {
  const theme = useTheme();
  const navigation = useNavigation<StackNavigationProp<TRootStackParamList>>();

  const [formData, setFormData] = useState<TFormData>({
    name: item?.name || '',
    description: item?.description || '',
    price: item?.price ? item?.price + '' : '',
    rentalPeriod: item?.rentalPeriod || 'daily',
    dateRange: {
      startDate: item?.dateRange?.startDate || '',
      endDate: item?.dateRange?.endDate || '',
    },
    category: item?.category || '',
    location: item?.location || {
      latitude: -1,
      longitude: -1,
      address: '',
    },
    images: item?.images || [],
  });
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [markedDates, setMarkedDates] = useState({});

  const onDayPress = (day: DateData) => {
    // If we don't have a start date or we're selecting a new range (after having both start and end dates)
    if (
      !formData.dateRange.startDate ||
      (formData.dateRange.startDate && formData.dateRange.endDate)
    ) {
      // Start a new range
      const startDate = day.dateString;

      // Update form data
      setFormData(prev => ({
        ...prev,
        dateRange: {
          startDate,
          endDate: '',
        },
      }));

      // Mark the selected date
      setMarkedDates({
        [startDate]: {
          selected: true,
          color: theme.colors.primary,
          textColor: colors.white,
          startingDay: true,
          endingDay: true,
        },
      });
    }
    // If we have a start date but no end date
    else if (formData.dateRange.startDate && !formData.dateRange.endDate) {
      let startDate = formData.dateRange.startDate;
      let endDate = day.dateString;

      // Ensure endDate is after startDate
      if (new Date(endDate) < new Date(startDate)) {
        const temp = startDate;
        startDate = endDate;
        endDate = temp;
      }

      // Calculate dates between start and end
      const range = getDateRange(startDate, endDate);

      // Update form data
      setFormData(prev => ({
        ...prev,
        dateRange: {
          startDate,
          endDate,
        },
      }));

      // Mark the selected range
      setMarkedDates(range);
    }
  };

  // Function to get the date range between start and end dates
  const getDateRange = (startDate: string, endDate: string) => {
    const range: {[key: string]: any} = {};
    let start = new Date(startDate);
    const end = new Date(endDate);

    // Mark start date
    range[startDate] = {
      selected: true,
      color: theme.colors.primary,
      textColor: colors.white,
      startingDay: true,
    };

    // Mark dates in between
    let currentDate = new Date(start);
    currentDate.setDate(currentDate.getDate() + 1);

    while (currentDate < end) {
      const dateString = currentDate.toISOString().split('T')[0];
      range[dateString] = {
        selected: true,
        color: theme.colors.primary + '80', // Add transparency
        textColor: colors.white,
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Mark end date
    range[endDate] = {
      selected: true,
      color: theme.colors.primary,
      textColor: colors.white,
      endingDay: true,
    };

    return range;
  };

  // Calculate available dates (e.g., disable past dates)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Format date range for display
  const formatDateRange = () => {
    if (formData.dateRange.startDate && formData.dateRange.endDate) {
      const start = new Date(formData.dateRange.startDate).toLocaleDateString();
      const end = new Date(formData.dateRange.endDate).toLocaleDateString();
      return `${start} - ${end}`;
    } else if (formData.dateRange.startDate) {
      return new Date(formData.dateRange.startDate).toLocaleDateString();
    }
    return 'Select date range';
  };

  // Calculate the number of days in the selected range
  const calculateDays = () => {
    if (formData.dateRange.startDate && formData.dateRange.endDate) {
      const start = new Date(formData.dateRange.startDate);
      const end = new Date(formData.dateRange.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days
      return diffDays;
    }
    return 0;
  };

  const handleImagePicker = async (type: string) => {
    handleMediaPicker(type, (asset: any) => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, asset],
      }));
    });
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    handleFormChange('images', newImages);
  };

  const handleSubmit = async () => {
    const requiredFields = {
      name: 'Item Name',
      description: 'Item Description',
      price: 'Price',
      category: 'Category',
      images: 'Images',
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field as keyof typeof formData]) {
        Toast.show({
          type: 'error',
          text1: 'Missing Information',
          text2: `Please enter ${label}`,
        });
        return;
      }
    }

    // Check if date range is selected
    if (!formData.dateRange.startDate || !formData.dateRange.endDate) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please select a date range for availability',
      });
      return;
    }

    if (formData.images.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please add at least one image',
      });
      return;
    }

    setLoading(true);
    try {
      const mediaData = new FormData();
      formData.images.forEach((image, index) => {
        mediaData.append('images', {
          uri: image.uri,
          type: image.type || 'image/jpeg',
          name: `${formData.name}_image_${index}.jpg`,
        });
      });

      const imageUrls = await chatApi.mediaUpload(mediaData);

      const submitFormData: TFormData = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        rentalPeriod: formData.rentalPeriod,
        dateRange: formData.dateRange,
        category: formData.category,
        images: imageUrls,
        location: formData.location,
      };

      if (submitFormData) {
        let response;
        if (editing) {
          response = await itemApi.updateItem(item?.id, submitFormData);
        } else {
          response = await itemApi.createItem(submitFormData);
        }
        if (response.item) {
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: editing
              ? 'Item updated successfully'
              : 'Item listed successfully',
          });
          resetFormData();
          setMarkedDates({});
          setVisible(false);
          navigation.replace('ItemDetails', {item: response.item});
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Failed to list item',
          });
        }
      }
    } catch (error) {
      console.error('Submit error:', JSON.stringify(error));
    } finally {
      setLoading(false);
    }
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      rentalPeriod: 'daily',
      dateRange: {
        startDate: '',
        endDate: '',
      },
      category: '',
      location: {
        latitude: -1,
        longitude: -1,
        address: '',
      },
      images: [],
    });
  };

  const handleLocationSelect = (location: TLocation) => {
    console.log('Location:', location);
    setFormData(prev => ({
      ...prev,
      location: location,
    }));
  };

  const getContainerStyle = (): ViewStyle => {
    if (fullScreen) {
      return {
        width: '100%',
        height: isKeyboardVisible() ? '100%' : '90%',
        borderRadius: 0,
      };
    }
    return {
      width: '95%',
      height: '85%',
      borderRadius: 10,
      overflow: 'hidden',
    };
  };

  const renderLocationSection = () => {
    const { address } = formData.location;
    return (
      <View style={styles.groupContainer}>
        <CustomText variant="h3" bold={700} style={{color: theme.colors.text.primary}}>
          Location
        </CustomText>
        <Divider />

        <TouchableOpacity
          style={[
            styles.locationButton,
            {backgroundColor: theme.colors.surface},
          ]}
          onPress={() => setShowMap(true)}>
          <View style={styles.locationButtonContent}>
            <MaterialIcon
              name="location-on"
              size={20}
              color={theme.colors.primary}
            />
            <Text
              style={{
                color: theme.colors.text.primary,
                marginLeft: 8,
                flex: 1,
              }}>
              {address === ''
                ? 'Select location'
                : address}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderAvailabilityPeriodSection = () => {
    return (
      <View style={styles.groupContainer}>
        <CustomText variant="h3" bold={700} style={{color: theme.colors.text.primary}}>
          Availability Period
        </CustomText>
        <Divider />
        <View style={{gap: 10}}>
          <View style={styles.inputContainer}>
            <Text
              style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
              Select Dates<Text style={{color: theme.colors.error}}>*</Text>
            </Text>

            <TouchableOpacity
              style={[
                styles.dateRangeButton,
                {backgroundColor: theme.colors.surface},
              ]}
              onPress={() => setShowCalendar(!showCalendar)}>
              <View style={styles.dateRangeButtonContent}>
                <MaterialIcon
                  name="event"
                  size={20}
                  color={theme.colors.primary}
                />
                <Text
                  style={{
                    color: formData.dateRange.startDate
                      ? theme.colors.text.primary
                      : colors.gray,
                    marginLeft: 8,
                    flex: 1,
                  }}>
                  {formatDateRange()}
                </Text>
                <Icon
                  name={showCalendar ? 'chevron-up' : 'chevron-down'}
                  size={16}
                  color={theme.colors.secondary}
                />
              </View>
            </TouchableOpacity>

            {showCalendar && (
              <View style={styles.calendarContainer}>
                <Calendar
                  minDate={getMinDate()}
                  onDayPress={onDayPress}
                  markingType={'period'}
                  markedDates={markedDates}
                  theme={{
                    calendarBackground: theme.colors.surface,
                    textSectionTitleColor: theme.colors.text.primary,
                    dayTextColor: theme.colors.text.primary,
                    todayTextColor: theme.colors.primary,
                    selectedDayTextColor: '#fff',
                    monthTextColor: theme.colors.text.primary,
                    selectedDayBackgroundColor: theme.colors.primary,
                    arrowColor: theme.colors.primary,
                    textDisabledColor: colors.gray,
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '500',
                    textDayFontSize: 14,
                    textMonthFontSize: 16,
                    textDayHeaderFontSize: 14,
                  }}
                />

                {formData.dateRange.startDate && formData.dateRange.endDate && (
                  <View
                    style={[
                      styles.selectedDaysInfo,
                      {backgroundColor: theme.colors.surface},
                    ]}>
                    <Text style={{color: theme.colors.text.primary}}>
                      Selected: {calculateDays()} day
                      {calculateDays() !== 1 ? 's' : ''}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.confirmDatesButton,
                        {backgroundColor: theme.colors.primary},
                      ]}
                      onPress={() => setShowCalendar(false)}>
                      <Text style={{color: '#fff'}}>Confirm</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderPricingSection = () => {
    return (
      <View style={styles.groupContainer}>
        <View style={{gap: 21}}>
          <View style={styles.inputContainer}>
            <Text
              style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
              Price (Rs/day)
              <Text style={{color: theme.colors.error}}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.primary,
                },
              ]}
              value={formData.price}
              onChangeText={value => handleFormChange('price', value)}
              placeholder="Enter price"
              placeholderTextColor={colors.gray}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
              Category<Text style={{color: theme.colors.error}}>*</Text>
            </Text>
            <SelectDropdown
              data={categories}
              onSelect={selectedItem =>
                handleFormChange('category', selectedItem?.name)
              }
              renderButton={(selectedItem, isOpened) => {
                return (
                  <View
                    style={{
                      height: 50,
                      backgroundColor: theme.colors.surface,
                      borderRadius: 12,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingHorizontal: 12,
                      ...(isOpened && {
                        backgroundColor: theme.colors.surface,
                      }),
                    }}>
                    <Text style={{color: theme.colors.text.primary}}>
                      {formData.category || 'Select category'}
                    </Text>
                    <Icon
                      name={isOpened ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={theme.colors.secondary}
                    />
                  </View>
                );
              }}
              renderItem={(selectedItem, index, isSelected) => {
                return (
                  <View
                    style={{
                      width: '100%',
                      flexDirection: 'row',
                      paddingHorizontal: 12,
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingVertical: 10,
                      ...(isSelected && {
                        backgroundColor: theme.colors.secondary,
                      }),
                    }}>
                    <Text
                      style={{
                        color: isSelected ? '#fff' : theme.colors.text.primary,
                      }}>
                      {selectedItem?.name}
                    </Text>
                  </View>
                );
              }}
              dropdownStyle={{
                backgroundColor: theme.colors.surface,
                marginTop: 10,
                borderRadius: 15,
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderBasicDetailsSection = () => {
    return (
      <View style={styles.groupContainer}>
        <CustomText
          variant="h3"
          bold={700}
          style={{color: theme.colors.text.primary}}>
          Item Details
        </CustomText>
        <Divider />
        <View style={{gap: 21}}>
          <View style={styles.inputContainer}>
            <Text
              style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
              Item Name<Text style={{color: theme.colors.error}}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.primary,
                },
              ]}
              value={formData.name}
              onChangeText={value => handleFormChange('name', value)}
              placeholder="Enter item name"
              placeholderTextColor={colors.gray}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text
              style={[styles.inputLabel, {color: theme.colors.text.primary}]}>
              Description<Text style={{color: theme.colors.error}}>*</Text>
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.descriptionInput,
                {
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.primary,
                },
              ]}
              value={formData.description}
              onChangeText={value => handleFormChange('description', value)}
              placeholder="Enter item description"
              placeholderTextColor={colors.gray}
              multiline
            />
          </View>
        </View>
      </View>
    );
  };

  const renderMediaSection = () => {
    return (
      <View style={{marginBottom: 100}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <CustomText variant="h3" bold={700} style={{color: theme.colors.text.primary}}>
            Add Photos
          </CustomText>
          <View style={styles.imageButtons}>
            <TouchableOpacity
              style={[
                styles.imageButton,
                {
                  borderColor: theme.colors.primary,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                },
              ]}
              onPress={() => handleImagePicker('camera')}>
              <Icon name="camera" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.imageButton,
                {
                  borderColor: theme.colors.primary,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 8,
                },
              ]}
              onPress={() => handleImagePicker('gallery')}>
              <Icon name="image" size={16} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <Divider />
        {formData.images?.length > 0 && (
          <View style={styles.imageSection}>
            <ScrollView
              horizontal
              style={styles.imagePreviewContainer}
              showsHorizontalScrollIndicator={false}>
              {formData.images.map((image, index) => (
                <View key={index} style={styles.imagePreview}>
                  <CustomImage
                    source={image.uri}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}>
                    <Icon
                      name="times-circle"
                      size={24}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <>
        {fullScreen && (
          <CustomText
            bold={600}
            style={{
              fontSize: 22,
              marginVertical: 15,
            }}>
            Add New Item for Rent{' '}
          </CustomText>
        )}
      </>
    );
  };

  const renderFooter = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 15,
          position: 'absolute',
          bottom: 0,
          gap: 10,
          backgroundColor: theme.colors.background,
          borderTopWidth: 1,
          borderTopColor: theme.colors.surface,
        }}>
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.disabledButton, {borderColor: theme.colors.primary, borderWidth: 1}]}
          onPress={() => {
            setVisible(false);
            resetFormData();
          }}
          disabled={loading}>
          <CustomText
            variant="h3"
            bold={700}
            style={{textAlign: 'center', color: theme.colors.text.secondary}}>
            {fullScreen ? 'RESET' : 'CANCEL'}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.submitButton,
            {backgroundColor: theme.colors.primary},
            loading && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <CustomText
              variant="h3"
              bold={700}
              style={{textAlign: 'center', color: colors.white}}>
              {editing ? 'UPDATE ITEM' : 'ADD ITEM'}
            </CustomText>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <View style={getContainerStyle()}>
        <ScrollView
          style={[
            styles.container,
            {backgroundColor: theme.colors.background},
          ]}>
          {renderHeader()}
          {renderBasicDetailsSection()}
          {renderPricingSection()}
          {renderAvailabilityPeriodSection()}
          {renderLocationSection()}
          {renderMediaSection()}
        </ScrollView>
        {renderFooter()}
      </View>
      {showMap && (
        <MapViewer
          showMap={showMap}
          setShowMap={setShowMap}
          onLocationSelect={handleLocationSelect}
          initialLocation={
            formData.location.latitude !== -1 ? formData.location : undefined
          }
        />
      )}
    </>
  );
};

export default NewItemForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  imageSection: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'rgba(86, 86, 86, 0.1)',
    borderRadius: 10,
  },
  imageButton: {
    width: 40,
    height: 40,
  },
  imageButtonText: {
    marginLeft: 12,
    fontWeight: '500',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    padding: 12,
  },
  imagePreview: {
    marginRight: 16,
    position: 'relative',
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  removeImageButton: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 2,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  input: {
    borderWidth: 0,
    padding: 16,
    borderRadius: 12,
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.7,
  },
  groupContainer: {
    marginBottom: 24,
  },
  rowLayout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    marginBottom: 8,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  dateRangeButton: {
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  dateRangeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  selectedDaysInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  confirmDatesButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  locationButton: {
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  locationButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapPreviewContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
  },
});
