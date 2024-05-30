import React from "react";
import { Text, View, Image, TouchableOpacity, StyleSheet } from "react-native";

const EventCard = ({
    title, date, location, imageUrl, canRSVP, onPress
}) => {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            {imageUrl && <Image source={{imageUrl}} style={styles.image} />}
            <View style={styles.content}>
                <Text style={styles.title}> {title} </Text>
                <Text style={styles.date}> {date} </Text>
                <Text style={styles.location}> {location} </Text>
                {canRSVP && <Text style={styles.rsvp}>RSVP</Text>}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "white",
        borderRadius: 10,
        marginBottom: 20,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    date: {
        fontSize: 16,
        color: "#888",
        marginBottom: 5,
    },
    location: {
        fontSize: 16,
        color: "#888",
        marginBottom: 10,
    },
    rsvp: {
        color: "blue",
        fontSize: 16,
    },
});

export default EventCard;