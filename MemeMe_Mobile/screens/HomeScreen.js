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
        posts: []
    }
  }

  getPosts() {
      fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/posts?sort=newest&parentID=", {
          method: "GET",
          headers: new Headers({
              'Content-Type': 'application/json'
          })
      })
      .then(response => response.json())
      .then(json => {
          this.setState({
              posts: json[0]
          })
      })
  }


  render() {
      this.getPosts()
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

            {this.state.posts.map(post => (
                <View style={styles.card} key={post.id}>
                    <Text style={styles.cardTitle}>{post.content} by {post.author.username}</Text>
                    <Image
                        style={styles.cardImage}
                        source={{ uri: post['thumbnailURL']}}
                    />
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