import React from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
const Dashboard = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Pressable style={styles.button}
                onPressIn={() => { navigation.navigate("Input") }}>
                <Text style={styles.text}>Input</Text>
            </Pressable>
            <Pressable style={styles.button}
                onPressIn={() => { navigation.navigate("Display") }}>
                <Text style={styles.text}>Display</Text>
            </Pressable>
            <Pressable style={styles.button}
                onPressIn={() => { navigation.navigate("Help") }}>
                <Text style={styles.text}>Help</Text>
            </Pressable>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccc',
        justifyContent: 'center',
    },
    button:
    {
        backgroundColor: 'green',
        marginHorizontal: 20,
        marginVertical: 5,
        elevation: 3,
        borderRadius: 5,
        padding: 16
    },
    text:
    {
        textAlign: 'center',
        color: "white",
        fontWeight: "500"
    }
});

export default Dashboard;
