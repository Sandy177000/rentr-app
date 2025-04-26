import React from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import CustomText from './common/CustomText';
import Icon from 'react-native-vector-icons/FontAwesome';
import ListItem from './ListItem';
import EmptyListComponent from './EmptyListComponent';

const TwoColumnListView = ({
  loading,
  items,
  theme,
  navigation,
  onRefresh,
  emptyText,
  emptyComponent,
  showFavorite,
}) => {
  const getEmptyComponent = () => {
    if (!loading && items.length === 0) {
      return (
        <EmptyListComponent>
          {emptyText ? (
            <View style={styles.emptyContainer}>
              <Icon
                name="inbox"
                size={50}
                color={theme.colors.text.secondary}
              />
              <CustomText
                variant="h4"
                style={[{color: theme.colors.text.secondary}]}>
                {emptyText}
              </CustomText>
            </View>
          ) : (
            emptyComponent()
          )}
        </EmptyListComponent>
      );
    } else {
      return <ActivityIndicator size="large" color={theme.colors.primary} />;
    }
  };

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={items}
        renderItem={({item, index}) => {
          return (
            <ListItem
              item={item}
              index={index}
              theme={theme}
              navigation={navigation}
              showFavorite={showFavorite}
            />
          );
        }}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[
          styles.listContent,
          items.length === 0 && styles.emptyListContent,
        ]}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={onRefresh} />
        }
        ListEmptyComponent={getEmptyComponent()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    padding: 30,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});

export default TwoColumnListView;
