import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {Alert, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';
import * as SecureStore from "expo-secure-store";

export default class HomeScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            token: '',
            userID: '',
            following: [],
            followUsername: '',
            friendID: '',
        }
    }


    getFollowingList() {
        fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/connections?userID=" + this.state.userID, {
            method: "get",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ this.state.token
            }
        })
            .then(res => res.json())
            .then(
                result => {
                    if (result) {
                        this.setState({
                            following: result[0],
                        });
                    }
                },
            );
    }


    followUser() {
        fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/users?username=" + this.state.followUsername, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(
                result => {
                    if (result[1] == 1) {
                        this.setState({
                            friendID: result[0][0]['id'],
                        });
                    }
                    else {
                        Alert.alert("User Does Not Exist", "You entered a username that does not exist!")
                        return
                    }
                },
            )
            .then(() => {
                fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/connections", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ this.state.token
                    },
                    body: JSON.stringify({
                        connectedUserID: parseInt(this.state.friendID),
                        userID: parseInt(this.state.userID.toString()),
                        type:"friend",
                        status:"active"
                    })
                })
                    .then(res => res.json())
                    .then(
                        result => {
                            this.setState({
                                friendID: '',
                            });
                        },
                    );
                this.getFollowingList();

            })
    }


    unfollowUser(connectionID) {
        fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/connections/" + connectionID, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ this.state.token
            }
        })
            .then(() => {
                this.getFollowingList();
            })
    }


    componentDidMount() {
        SecureStore.getItemAsync("session").then((token) => {
            this.setState({
                token: token
            });
        })
            .then(() => {
                SecureStore.getItemAsync("userID").then((id) => {
                    this.setState({
                        userID: id
                    });
                })
                    .then(() => {
                        this.getFollowingList();
                    })
            })
    }


    render() {
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.card}>
                        <Text style={styles.followingText}>Follow a User</Text>
                        <TextInput
                            style={styles.followingInput}
                            placeholder="Enter a Username"
                            onChangeText={text => this.setState({followUsername: text})}
                        />
                        <TouchableOpacity
                            style={styles.followButton}
                            onPress={() => this.followUser()}
                            underlayColor='#fff'>
                            <Text style={styles.followButtonText}>Follow</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.container}>
                        <Text>{"\n"}</Text>
                    </View>

                    {this.state.following.map(user => (
                        <View style={styles.card} key={user.id}>
                            <Text style={styles.cardTitle}>{user.connectedUser.username}</Text>
                            <TouchableOpacity
                                style={styles.unfollowButton}
                                onPress={() => this.unfollowUser(user.id)}
                                underlayColor='#fff'>
                                <Text style={styles.unfollowButtonText}>Unfollow</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    }
}

HomeScreen.navigationOptions = {
    header: null,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#282c34',
    },
    contentContainer: {
        padding: 20,
    },
    card: {
        width: '100%',
        backgroundColor: 'white',
        padding: 10,
        marginBottom: 10
    },
    cardTitle: {
        fontSize: 20,
        marginBottom: 10
    },
    cardImage: {
        flex: 1,
        aspectRatio: 1.5,
        resizeMode: 'contain',
    },
    unfollowButton: {
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#FF5959',
    },
    unfollowButtonText: {
        color: '#fff',
        fontSize: 18,
        lineHeight: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
    followingText: {
        fontStyle: 'normal',
        fontSize: 18,
        lineHeight: 20,
        color: 'black',
        position: 'relative',
        left: -2.6,
    },
    followingInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        backgroundColor: 'white'
    },
    followButton: {
        marginTop: 10,
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: '#30D82D',
    },
    followButtonText: {
        color: '#fff',
        fontSize: 18,
        lineHeight: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingLeft: 10,
        paddingRight: 10
    },
});