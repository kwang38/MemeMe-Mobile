import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {Alert, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as SecureStore from "expo-secure-store";

export default class Upload extends React.Component {
    constructor() {
        super();
        this.state = {
            title: '',
            imageURL: '',
            token: '',
            userID: ''
        }
    }


    createPost(){
        if (this.state.title.length == 0) {
            Alert.alert("Invalid Input", "You need a post title to continue")
        }
        else if (this.state.imageURL.length == 0) {
            Alert.alert("Invalid Input", "You need to include an image URL to continue")
        }
        else if (!this.state.imageURL.match("(?:([^:/?#]+):)?(?://([^/?#]*))?([^?#]*\\.(?:jpg|gif|png))(?:\\?([^#]*))?(?:#(.*))?")){
            Alert.alert("Invalid Input", "You must use a proper image URL")
        }
        else {
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
                            fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/posts", {
                                method: "POST",
                                headers: new Headers({
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer '+ this.state.token
                                }),
                                body: JSON.stringify({
                                    authorID: this.state.userID,
                                    content: this.state.title,
                                    type: "post",
                                    thumbnailURL: this.state.imageURL
                                })
                            })
                            this.textInput.clear()
                            this.textInput2.clear()
                            this.props.navigation.navigate("Home");
                        })
                })
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.inputText}>
                    {"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}{"\n"}
                    Title*
                </Text>
                <TextInput
                    style={styles.input}
                    ref={input => { this.textInput = input }}
                    onChangeText={text => this.setState({title: text})}
                    // value={email}
                    // textContentType="text"
                />
                <Text style={styles.inputText}>{"\n"}Image URL*</Text>
                <TextInput
                    style={styles.input}
                    ref={input => { this.textInput2 = input }}
                    onChangeText={text => this.setState({imageURL: text})}
                    // value={password}
                    textContentType="URL"
                />
                <TouchableOpacity
                    style={styles.postButton}
                    onPress={() => this.createPost()}
                    underlayColor='#fff'>
                    <Text style={styles.postButtonText}>Post</Text>
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
  postButton: {
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#2D86D8',
  },
  postButtonText: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingLeft: 10,
    paddingRight: 10
  },
});
