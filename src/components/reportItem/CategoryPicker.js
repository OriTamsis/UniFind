import React from 'react';
import { View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { styles } from '../../styles/reportItem';

export const CategoryPicker = ({ itemCategory, setItemCategory }) => {
    return (
        <View style={[styles.input, { padding: 0 }]}>
            <Picker
                selectedValue={itemCategory}
                onValueChange={setItemCategory}
                style={{ color: '#fff' }}
                dropdownIconColor="#fff"
            >
                <Picker.Item label="Select Category" value="" enabled={false} />
                <Picker.Item label="Academic & Study Materials" value="Academic & Study Materials" />
                <Picker.Item label="Bags & Wearables" value="Bags & Wearables" />
                <Picker.Item label="Electronics & Gadgets" value="Electronics & Gadgets" />
                <Picker.Item label="Keys & Identification" value="Keys & Identification" />
                <Picker.Item label="Other" value="Other" />
            </Picker>
        </View>
    );
};