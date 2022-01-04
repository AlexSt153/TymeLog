import React, { useRef, useMemo, useCallback } from 'react';
import { TouchableOpacity, View } from 'react-native';
import moment from 'moment';
import { List, Portal, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import BottomSheet from '@gorhom/bottom-sheet';

interface IBackgroundItem {
  item: any;
}

export default function BackgroundItem({ item }: IBackgroundItem) {
  const { colors } = useTheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%'], []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  console.log('item :>> ', item);

  return (
    <View style={{ width: '90%', alignSelf: 'center' }}>
      <TouchableOpacity
        onPress={() => {
          bottomSheetRef.current?.expand();
        }}
      >
        <List.Item
          title={moment(item.timestamp).format('HH:mm')}
          description={item.address}
          left={(props) => (
            <MaterialCommunityIcons
              {...props}
              style={{
                alignSelf: 'center',
                marginRight: 20,
              }}
              name="map-marker-outline"
              size={24}
              color={colors.text}
            />
          )}
        />
      </TouchableOpacity>
      <Portal>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          handleIndicatorStyle={{
            backgroundColor: colors.text,
          }}
          backgroundStyle={{ backgroundColor: colors.card }}
          enablePanDownToClose
        >
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            {/* TODO: add functions to save data to server */}
            <Text>convert background item</Text>
            <Text>choose start, pause or end</Text>
            <Text>confirm date and time</Text>
          </View>
        </BottomSheet>
      </Portal>
    </View>
  );
}
