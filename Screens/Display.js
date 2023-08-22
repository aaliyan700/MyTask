import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, Image } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { AntDesign } from '@expo/vector-icons';

const db = SQLite.openDatabase('mydb.db');

const Display = () => {
    const [userData, setUserData] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editedData, setEditedData] = useState({
        id: null,
        registrationNumber: '',
        fullName: '',
        courseName: '',
        email: '',
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = () => {
        db.transaction(tx => {
            tx.executeSql(
                `SELECT * FROM UserData1;`,
                [],
                (_, { rows }) => {
                    setUserData(rows._array);
                },
                (_, error) => {
                    console.error("Error fetching data:", error);
                }
            );
        });
    };

    const deleteUser = (id) => {
        db.transaction(tx => {
            tx.executeSql(
                `DELETE FROM UserData1 WHERE id = ?;`,
                [id],
                () => {
                    console.log("User deleted successfully");
                    fetchUserData();
                },
                (_, error) => {
                    console.error("Error deleting user:", error);
                }
            );
        });
    };

    const handleUpdate = () => {
        db.transaction(tx => {
            tx.executeSql(
                `UPDATE UserData1 SET registrationNumber = ?, fullName = ?, courseName = ?, email = ? WHERE id = ?;`,
                [
                    editedData.registrationNumber,
                    editedData.fullName,
                    editedData.courseName,
                    editedData.email,
                    editedData.id,
                ],
                () => {
                    console.log("User updated successfully");
                    fetchUserData();
                    setIsModalVisible(false);
                    setEditedData({
                        id: null,
                        registrationNumber: '',
                        fullName: '',
                        courseName: '',
                        email: '',
                    });
                },
                (_, error) => {
                    console.error("Error updating user:", error);
                }
            );
        });
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditedData({
            id: null,
            registrationNumber: '',
            fullName: '',
            courseName: '',
            email: '',
        });
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {userData.map((data) => (
                    <View key={data.id} style={styles.userContainer}>
                        <Image source={{ uri: data.imageUri }} style={styles.userImage} />
                        <Text style={styles.info}>Registration Number: {data.registrationNumber}</Text>
                        <Text style={styles.info}>Full Name: {data.fullName}</Text>
                        <Text style={styles.info}>Course Name: {data.courseName}</Text>
                        <Text style={styles.info}>Email: {data.email}</Text>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => deleteUser(data.id)}
                            >
                                <AntDesign name="delete" size={24} color="red" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.iconButton}
                                onPress={() => {
                                    setEditingUser(data);
                                    setEditedData(data);
                                    setIsModalVisible(true);
                                }}
                            >
                                <AntDesign name="edit" size={24} color="blue" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            placeholder="Registration Number"
                            value={editedData.registrationNumber}
                            onChangeText={(text) =>
                                setEditedData({
                                    ...editedData,
                                    registrationNumber: text,
                                })
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Full Name"
                            value={editedData.fullName}
                            onChangeText={(text) =>
                                setEditedData({
                                    ...editedData,
                                    fullName: text,
                                })
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Course Name"
                            value={editedData.courseName}
                            onChangeText={(text) =>
                                setEditedData({
                                    ...editedData,
                                    courseName: text,
                                })
                            }
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={editedData.email}
                            onChangeText={(text) =>
                                setEditedData({
                                    ...editedData,
                                    email: text,
                                })
                            }
                        />
                        <TouchableOpacity
                            style={styles.updateButton}
                            onPress={handleUpdate}
                        >
                            <Text style={styles.updateButtonText}>Update</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={handleCancel}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ccc',
        padding: 20,
    },
    userContainer: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        elevation: 3,
    },
    userImage: {
        width: 200,
        height: 150,
        borderRadius: 10,
        alignSelf: 'center',
        marginBottom: 10,
    },
    info: {
        fontSize: 16,
        marginBottom: 5,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
    },
    iconButton: {
        padding: 5,
        marginLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: '80%',
    },
    input: {
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    updateButton: {
        backgroundColor: 'green',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    updateButtonText: {
        color: 'white',
        fontSize: 16,
    },
    cancelButton: {
        backgroundColor: 'gray',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 5,
    },
    cancelButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default Display;











// import React, { useEffect, useState } from 'react';
// import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
// import * as SQLite from 'expo-sqlite';
// import { AntDesign } from '@expo/vector-icons';
// const db = SQLite.openDatabase('mydb.db');

// const Display = () => {
//     const [userData, setUserData] = useState([]);
//     const [editingUser, setEditingUser] = useState(null);
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const [editedData, setEditedData] = useState({
//         id: null,
//         registrationNumber: '',
//         fullName: '',
//         courseName: '',
//         email: '',
//     });

//     useEffect(() => {
//         fetchUserData();
//     }, []);

//     const fetchUserData = () => {
//         db.transaction((tx) => {
//             tx.executeSql(
//                 `SELECT * FROM UserData1;`,
//                 [],
//                 (_, { rows }) => {
//                     setUserData(rows._array);
//                 },
//                 (_, error) => {
//                     console.error("Error fetching data:", error);
//                 }
//             );
//         });
//     };

//     const deleteUser = (id) => {
//         db.transaction((tx) => {
//             tx.executeSql(
//                 `DELETE FROM UserData1 WHERE id = ?;`,
//                 [id],
//                 () => {
//                     console.log("User deleted successfully");
//                     fetchUserData();
//                 },
//                 (_, error) => {
//                     console.error("Error deleting user:", error);
//                 }
//             );
//         });
//     };

//     const handleUpdate = () => {
//         db.transaction((tx) => {
//             tx.executeSql(
//                 `UPDATE UserData1 SET registrationNumber = ?, fullName = ?, courseName = ?, email = ? WHERE id = ?;`,
//                 [
//                     editedData.registrationNumber,
//                     editedData.fullName,
//                     editedData.courseName,
//                     editedData.email,
//                     editedData.id,
//                 ],
//                 () => {
//                     console.log("User updated successfully");
//                     fetchUserData();
//                     setIsModalVisible(false);
//                 },
//                 (_, error) => {
//                     console.error("Error updating user:", error);
//                 }
//             );
//         });
//     };

//     const handleCancel = () => {
//         setIsModalVisible(false);
//     };

//     return (
//         <View style={styles.container}>
//             <ScrollView>
//                 {userData.map((data) => (
//                     <View key={data.id} style={styles.userContainer}>
//                         <Text style={styles.info}>Registration Number: {data.registrationNumber}</Text>
//                         <Text style={styles.info}>Full Name: {data.fullName}</Text>
//                         <Text style={styles.info}>Course Name: {data.courseName}</Text>
//                         <Text style={styles.info}>Email: {data.email}</Text>
//                         <View style={styles.iconContainer}>
//                             <TouchableOpacity
//                                 style={styles.iconButton}
//                                 onPress={() => deleteUser(data.id)}
//                             >
//                                 <AntDesign name="delete" size={24} color="red" />
//                             </TouchableOpacity>
//                             <TouchableOpacity
//                                 style={styles.iconButton}
//                                 onPress={() => {
//                                     setEditingUser(data);
//                                     setEditedData(data);
//                                     setIsModalVisible(true);
//                                 }}
//                             >
//                                 <AntDesign name="edit" size={24} color="blue" />
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 ))}
//             </ScrollView>
//             <Modal
//                 visible={isModalVisible}
//                 animationType="slide"
//                 transparent={true}
//             >
//                 <View style={styles.modalContainer}>
//                     <View style={styles.modalContent}>
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Registration Number"
//                             value={editedData.registrationNumber}
//                             onChangeText={(text) =>
//                                 setEditedData({
//                                     ...editedData,
//                                     registrationNumber: text,
//                                 })
//                             }
//                         />
//                         <TextInput
//                             style={styles.input}
//                             placeholder="FullName"
//                             value={editedData.fullName}
//                             onChangeText={(text) =>
//                                 setEditedData({
//                                     ...editedData,
//                                     fullName: text,
//                                 })
//                             }
//                         />
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Course Name"
//                             value={editedData.courseName}
//                             onChangeText={(text) =>
//                                 setEditedData({
//                                     ...editedData,
//                                     courseName: text,
//                                 })
//                             }
//                         />
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Email"
//                             value={editedData.email}
//                             onChangeText={(text) =>
//                                 setEditedData({
//                                     ...editedData,
//                                     email: text,
//                                 })
//                             }
//                         />
//                         {/* Add similar TextInputs for other fields */}
//                         <TouchableOpacity
//                             style={styles.updateButton}
//                             onPress={handleUpdate}
//                         >
//                             <Text style={styles.updateButtonText}>Update</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             style={styles.cancelButton}
//                             onPress={handleCancel}
//                         >
//                             <Text style={styles.cancelButtonText}>Cancel</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </View>
//             </Modal>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#ccc',
//         padding: 20,
//     },
//     userContainer: {
//         backgroundColor: 'white',
//         borderWidth: 1,
//         borderColor: 'white',
//         borderRadius: 10,
//         padding: 15,
//         marginBottom: 20,
//         elevation: 3,
//     },
//     info: {
//         fontSize: 16,
//         marginBottom: 5,
//     },
//     iconContainer: {
//         flexDirection: 'row',
//         justifyContent: 'flex-end',
//         marginTop: 10,
//     },
//     iconButton: {
//         padding: 5,
//         marginLeft: 10,
//     },
//     modalContainer: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     },
//     modalContent: {
//         backgroundColor: 'white',
//         borderRadius: 10,
//         padding: 20,
//         width: '80%',
//     },
//     input: {
//         marginBottom: 10,
//         paddingHorizontal: 10,
//         paddingVertical: 5,
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: 5,
//     },
//     updateButton: {
//         backgroundColor: 'green',
//         padding: 10,
//         borderRadius: 5,
//         alignItems: 'center',
//         marginTop: 10,
//     },
//     updateButtonText: {
//         color: 'white',
//         fontSize: 16,
//     },
//     cancelButton: {
//         backgroundColor: 'gray',
//         padding: 10,
//         borderRadius: 5,
//         alignItems: 'center',
//         marginTop: 5,
//     },
//     cancelButtonText: {
//         color: 'white',
//         fontSize: 16,
//     },
// });

// export default Display;

