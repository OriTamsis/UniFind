import React from 'react';
import { View, Text } from 'react-native';
import { LocationInfo } from './LocationInfo';
import { ReporterInfo } from './ReporterInfo';
import { ContactButton } from './ContactButton';
import { DateInfo } from './DateInfo';
import { styles } from '../../styles/itemDetails';

export const ItemContent = ({ item, reporterName, createdDate, onContact }) => (
    <View style={styles.contentContainer}>
        <ReporterInfo reporterName={reporterName} />
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <DateInfo date={createdDate} />
        <LocationInfo />
        <ContactButton onPress={onContact} />
    </View>
);