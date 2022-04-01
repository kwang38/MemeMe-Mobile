import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/core';
import * as React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import Profile from '../screens/Profile';
import Upload from '../screens/Upload';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
    // Set the header title on the parent stack navigator depending on the
    // currently active tab. Learn more in the documentation:
    // https://reactnavigation.org/docs/en/screen-options-resolution.html
    navigation.setOptions({ headerTitle: getHeaderTitle(route) });

    return (
        <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
            <BottomTab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Posts',
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-book" />,
                }}
            />
            <BottomTab.Screen
                name="Upload"
                component={Upload}
                options={{
                    title: 'Upload',
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-create" />,
                }}
            />
            <BottomTab.Screen
                name="Profile"
                component={Profile}
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-person" />,
                }}
            />
        </BottomTab.Navigator>
    );
}

function getHeaderTitle(route) {
    const routeName = getFocusedRouteNameFromRoute(route);

    switch (routeName) {
        case 'Home':
            return 'Posts';
        case 'Profile':
            return 'My Profile';
        case 'Upload':
            return 'Add a New Post';
    }
}