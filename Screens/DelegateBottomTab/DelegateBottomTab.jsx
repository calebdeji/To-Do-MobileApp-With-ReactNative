import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Task from "../MyTask/Task";
import CreateTask from "../CreateTask/CreateTask";
import { PrimaryColor, WhiteColor } from "../../component/Shared/GlobalStyle";
import { TextStyle } from "../../component/AuthComponent/AuthComponentStyle";
const Tab = createBottomTabNavigator();
export default class DelegateBottomTab extends Component {
    constructor(props) {
        super(props);
        this.props;
    }
    componentDidMount() {}
    render() {
        const { routeTab } = this.props.route.params;
        return (
            <Tab.Navigator tabBar={props => <TabBar {...props} />} initialRouteName={routeTab}>
                <Tab.Screen name="Task" component={Task} />
                <Tab.Screen name="Dummy Task" component={Task} />
                <Tab.Screen name="Create Task" component={CreateTask} />
            </Tab.Navigator>
        );
    }
}

class TabBar extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        const { state, descriptors, navigation } = this.props;
        return (
            <View style={TabBarStyle.ViewStyle}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                            ? options.title
                            : route.name;
                    const isFocused = state.index === index;
                    const onPress = () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };
                    const onLongPress = () => {
                        navigation.emit({
                            type: "tabLongPress",
                            target: route.key
                        });
                    };
                    return (
                        <TouchableOpacity
                            accessibilityRole="button"
                            accessibilityStates={isFocused ? ["selected"] : []}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={TabBarStyle.TouchableStyle}
                            key={index}
                        >
                            <Text
                                style={{
                                    color: isFocused ? PrimaryColor : WhiteColor,
                                    fontSize: 17
                                }}
                            >
                                {label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    }
}

const TabBarStyle = StyleSheet.create({
    ViewStyle: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: "rgba(12, 12, 24, 0.938)",
        height: 60,
        alignItems: "center"
    },
    TouchableStyle: {
        flex: 1,
        display: "flex",
        alignItems: "center"
    },
    TextStyle: {}
});
