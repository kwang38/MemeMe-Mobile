import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import { MonoText } from '../components/StyledText';
import * as SecureStore from "expo-secure-store";

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
        followers: [],
    }
  }

    getFollowerCount() {
        fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/connections?connectedUserID=" + this.state.userID, {
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
                            followers: result[0]
                        });
                    }
                },
            );
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
                        this.getFollowerCount();
                    })
            })

    }



  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            {this.state.followers.map(user => (
                <View style={styles.card} key={user.id}>
                    <Text style={styles.cardTitle}>{user.user.username}</Text>
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
    }
});