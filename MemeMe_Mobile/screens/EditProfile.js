import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as SecureStore from "expo-secure-store";

export default class EditProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            token: '',
            userID: '',
            imageID: '',
            imageURL: '',
            username: '',
            email: '',
        }
    }


    edit_profile_picture() {
        if (!this.state.imageURL.match("(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*\\.(?:jpg|gif|png))(?:\\?([^#]*))?(?:#(.*))?")){
                Alert.alert("Invalid Input", "You must use a proper image URL");
                return
            }
        fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/user-artifacts?ownerID=" + this.state.userID + "&category=profile_picture", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ this.state.token
            },
        })
            .then(res => res.json())
            .then(
                result => {
                    console.log(result)
                    this.setState({
                        imageID: result[0][0]["id"],
                    });
                },
            )
            .then(() => {
                fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/user-artifacts/" + this.state.imageID, {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer '+ this.state.token
                    },
                    body: JSON.stringify({
                        url: this.state.imageURL
                    })
                })
                    .then(res => res.json())
                    .then(
                        result => {
                            console.log(result)
                            if (result['id'] == this.state.imageID) {
                                this.textInput.clear()
                            }
                        },
                    )
            })
    }


    edit_username() {
        fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/users?username=" + this.state.username, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ this.state.token
            },
        })
            .then(res => res.json())
            .then(
                result => {
                    if (result[1] != 0) {
                        Alert.alert("Username Taken", "Looks like the username you want is already taken.");
                    }
                    else {
                        fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/users/" + this.state.userID, {
                            method: "PATCH",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer '+ this.state.token
                            },
                            body: JSON.stringify({
                                username: this.state.username
                            })
                        })
                            .then(res => res.json())
                            .then(
                                result => {
                                    console.log(result)
                                    if (result['id'] == this.state.userID) {
                                        this.textInput2.clear()
                                    }
                                },
                            )
                    }
                },
            )
    }


    edit_email() {
        fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/users?email=" + this.state.email, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ this.state.token
            },
        })
            .then(res => res.json())
            .then(
                result => {
                    if (result[1] != 0) {
                        Alert.alert("Email Taken", "Looks like the email you want is already registered to another account.");
                    }
                    else {
                        fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/users/" + this.state.userID, {
                            method: "PATCH",
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer '+ this.state.token
                            },
                            body: JSON.stringify({
                                email: this.state.email
                            })
                        })
                            .then(res => res.json())
                            .then(
                                result => {
                                    console.log(result)
                                    if (result['id'] == this.state.userID) {
                                        this.textInput3.clear()
                                    }
                                },
                            )
                    }
                },
            )
    }


    editProfile(){
        console.log("HI")
        if (this.state.imageURL.length == 0 && this.state.username.length == 0 && this.state.email.length == 0) {
            Alert.alert("Input Validation", "You did not make any changes")
            return
        }
        if (this.state.imageURL.length > 0) {
            this.edit_profile_picture()
        }
        if (this.state.username.length > 0) {
            this.edit_username()
        }
        if (this.state.email.length > 0) {
            this.edit_email()
        }
        this.props.navigation.navigate("Profile");
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
            })
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.inputText}>{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"} Image URL</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => this.setState({imageURL: text})}
                    ref={input => { this.textInput = input }}
                />

                <Text style={styles.inputText}>{"\n"} Username</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => this.setState({username: text})}
                    ref={input => { this.textInput2 = input }}
                />

                <Text style={styles.inputText}>{"\n"} Email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={text => this.setState({email: text})}
                    ref={input => { this.textInput3 = input }}
                />

                <Text style={styles.inputText}>{"\n"}</Text>

                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => this.editProfile()}
                    underlayColor='#fff'>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34',
    padding: 50,
  },
  inputText: {
    fontStyle: 'normal',
    fontSize: 18,
    lineHeight: 20,
    color: 'white',
    position: 'relative',
    left: -2.6,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    backgroundColor: 'white'
  },
  saveButton: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#2D86D8',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
});
