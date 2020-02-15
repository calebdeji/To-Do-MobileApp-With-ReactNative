import React, { Component } from "react";

import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import SignUp from "./Screens/SignUp/SignUp";
import SignIn from "./Screens/SignIn/SignIn";
import Home from "./Screens/Home/Home";
import DelegateBottomTab from "./Screens/DelegateBottomTab/DelegateBottomTab";
import { Provider } from "react-redux";
import { Store } from "./redux/store";

const StackScreens = createStackNavigator();

export default class App extends Component {
    render() {
        return (
            <Provider store={Store}>
                <NavigationContainer>
                    <StackScreens.Navigator headerMode="none">
                        <StackScreens.Screen name="SignUp" component={SignUp} />
                        <StackScreens.Screen name="SignIn" component={SignIn} />
                        <StackScreens.Screen name="Home" component={Home} />
                        <StackScreens.Screen
                            name="DelegateBottomTab"
                            component={DelegateBottomTab}
                        />
                    </StackScreens.Navigator>
                </NavigationContainer>
            </Provider>
        );
    }
}
