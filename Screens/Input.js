import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ToastAndroid, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as SQLite from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';

const db = SQLite.openDatabase('mydb.db');

const Input = () => {
    const [registrationNumber, setRegistrationNumber] = useState('');
    const [fullName, setFullName] = useState('');
    const [courseName, setCourseName] = useState('');
    const [email, setEmail] = useState('');
    const [imageUri, setImageUri] = useState(null);

    const createTable = () => {
        db.transaction(tx => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS UserData1 (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    registrationNumber TEXT,
                    fullName TEXT,
                    courseName TEXT,
                    email TEXT,
                    imageUri TEXT
                );`,
                [],
                (_, result) => {
                    console.log("Table created successfully:", result);
                },
                (_, error) => {
                    console.error("Error creating table:", error);
                }
            );
        });
    };

    useEffect(() => {
        createTable();
    }, []);
    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) { // Change 'cancelled' to 'canceled'
            setImageUri(result.assets[0].uri);
        }
    };
    const insertData = () => {
        if (registrationNumber && fullName && courseName && email) {
            db.transaction(tx => {
                tx.executeSql(
                    `INSERT INTO UserData1 (registrationNumber, fullName, courseName, email, imageUri)
                    VALUES (?, ?, ?, ?, ?);`,
                    [registrationNumber, fullName, courseName, email, imageUri],
                    (_, result) => {
                        console.log("Insertion successful:", result);
                        ToastAndroid.show("Data Inserted Successfully", ToastAndroid.SHORT);
                        setRegistrationNumber('');
                        setFullName('');
                        setCourseName('');
                        setEmail('');
                        setImageUri(null);
                    },
                    (_, error) => {
                        console.log("Insertion error:", error);
                    }
                );
            });
        } else {
            alert("Please Input Required Fields");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                label="Registration Number"
                value={registrationNumber}
                onChangeText={setRegistrationNumber}
            />
            <TextInput
                style={styles.input}
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
            />
            <TextInput
                style={styles.input}
                label="Course Name"
                value={courseName}
                onChangeText={setCourseName}
            />
            <TextInput
                style={styles.input}
                label="Email Address"
                value={email}
                onChangeText={setEmail}
            />
            <Button
                mode="contained"
                style={styles.button}
                onPress={selectImage}
            >
                Select Image
            </Button>
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            <Button
                mode="contained"
                style={styles.button}
                onPress={insertData}
            >
                Save
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    input: {
        marginBottom: 20,
    },
    button: {
        marginTop: 10,
        backgroundColor: 'green',
    },
    image: {
        marginTop: 10,
        width: 200,
        height: 200,
    },
});

export default Input;


