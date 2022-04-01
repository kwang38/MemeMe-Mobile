import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';
import * as SecureStore from "expo-secure-store";

export default class Profile extends React.Component {
    constructor() {
        super();
        this.state = {
            token: '',
            userID: '',
            imageURL: '',
            username: '',
            email: '',
            followerCount: 0,
            followingCount: 0,
            reputationCount: 0,
        }
    }

    getProfilePicture() {
        fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/user-artifacts?ownerID=" + this.state.userID + "&category=profile_picture", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ this.state.token
            }
        })
            .then(res => res.json())
            .then(
                result => {
                    if ((result[0][0]["url"]).includes("/hci/fantasticfour/api/uploads/")) {
                        this.setState({
                            imageURL: "https://webdev.cse.buffalo.edu" + result[0][0]["url"]
                        });
                    }
                    else {
                        this.setState({
                            imageURL: result[0][0]["url"]
                        });
                    }
                }
            )
    }

    getUserDetails() {
        fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/users/" + this.state.userID, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ this.state.token
            }
        })
            .then(res => res.json())
            .then(
                result => {
                    this.setState({
                        username: result["username"],
                        email: result["email"]
                    });
                }
            );
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
                            followerCount: result[1]
                        });
                    }
                },
            );
    }

    getFollowingCount() {
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
                            followingCount: result[1]
                        });
                    }
                },
            );
    }


    getReputationCount() {
        fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/posts?sort=newest&authorID=" + this.state.userID, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => res.json())
            .then(
                result => {
                    for(const post of result[0]) {
                        fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/post-tags?postID=" + post['id'] + '&name=upvote&type=reaction', {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                            .then(res => res.json())
                            .then(
                                result => {
                                    this.setState({
                                        reputationCount: this.state.reputationCount + result[1]
                                    })
                                }
                            )
                        fetch("https://webdev.cse.buffalo.edu/hci/fantasticfour/api/api/post-tags?postID=" + post['id'] + '&name=downvote&type=reaction', {
                            method: "GET",
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        })
                            .then(res => res.json())
                            .then(
                                result => {
                                    this.setState({
                                        reputationCount: this.state.reputationCount - result[1]
                                    })
                                }
                            )
                    }
                }
            )
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
                        this.getProfilePicture();
                    })
                    .then(() => {
                        this.getUserDetails();
                    })
                    .then(() => {
                        this.getFollowerCount();
                    })
                    .then(() => {
                        this.getFollowingCount();
                    })
                    .then(() => {
                        this.getReputationCount();
                    })
            })

    }


    render() {
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.imageElem}>
                    <Image
                        style={styles.profileImage}
                        source={this.state.imageURL ? {uri: this.state.imageURL } : null}
                    />
                </View>
                <OptionButton
                    icon="ios-heart"
                    category="Followers: "
                    label={this.state.followerCount}
                    hasPage={'  ➡'}
                    onPress={() => {this.props.navigation.navigate("Followers")}}
                />
                <OptionButton
                    icon="ios-person-add"
                    category="Following: "
                    label={this.state.followingCount}
                    hasPage={'  ➡'}
                    onPress={() => {this.props.navigation.navigate("Following")}}
                />
                <OptionButton
                    icon="ios-trophy"
                    category="Reputation: "
                    label={this.state.reputationCount}
                />
                <OptionButton
                    icon="ios-person"
                    category="Username: "
                    label={this.state.username}
                />
                <OptionButton
                    icon="ios-mail"
                    category="Email: "
                    label={this.state.email}
                />
                <OptionButton
                    icon="ios-cog"
                    label="Edit profile"
                    hasPage={'  ➡'}
                    onPress={() => {this.props.navigation.navigate("Edit Profile")}}
                />
            </ScrollView>
        );
    }
}

function OptionButton({ icon, category, label, hasPage, onPress, isLastOption }) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
          <View style={styles.optionTextContainer}>
              <Text style={styles.optionText}>{category}</Text>
          </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
          <View style={styles.optionTextContainer}>
              <Text style={styles.isClickable}>{hasPage}</Text>
          </View>
      </View>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282c34',
  },
  contentContainer: {
    paddingTop: 15,
      justifyContent: 'center',

  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
    profileImage: {
        borderRadius: 500,
        width: 200,
        height: 200,
    },
    imageElem: {
        alignItems: 'center',
    },
    isClickable: {
        color: 'blue',
    }

});
