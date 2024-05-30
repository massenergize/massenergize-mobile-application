import React from "react";
import { View, StyleSheet } from "react-native";

const Page = ({ children }) => {
    return <View style={styles.page}> {children} </View>;
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: 'white',
        // paddingHorizontal: 10,
        // paddingVertical: 20,
    },
});

export default Page;