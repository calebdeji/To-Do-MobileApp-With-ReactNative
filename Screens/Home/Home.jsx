import React, { Component, Fragment } from "react";
import { View, Text, StyleSheet, TouchableHighlight } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WelcomingHead from "../../component/Shared/WelcomeHeading";
import HomeButton from "./HomeButton";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        const screenButtons = [
            { screenName: "Task", text: "My Task", id: 1 },
            { screenName: "Dummy Task", text: "List", id: 2 },
            { screenName: "Create Task", text: "Create Task", id: 3 }
        ];
        return (
            <Fragment>
                <SafeAreaView style={HomeStyle.SafeAreaViewStyle}>
                    <WelcomingHead />
                    <View style={{ aspectRatio: 1 }}>
                        {screenButtons.map(eachScreenButton => {
                            return (
                                <HomeButton
                                    key={eachScreenButton.id}
                                    navigateToTabs={() => {
                                        this.props.navigation.navigate("DelegateBottomTab", {
                                            routeTab: eachScreenButton.screenName
                                        });
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontWeight: "700",
                                            fontSize: 26,
                                            letterSpacing: 0.52,
                                            color: "#000000"
                                        }}
                                    >
                                        {" "}
                                        {eachScreenButton.text}
                                    </Text>
                                </HomeButton>
                            );
                        })}
                    </View>
                    <View style={HomeStyle.PositionedButton}>
                        <TouchableHighlight>
                            <Text
                                style={{
                                    fontWeight: "700",
                                    fontSize: 17,
                                    letterSpacing: 0.34,
                                    color: "#000000"
                                }}
                            >
                                {" "}
                                Logout{" "}
                            </Text>
                        </TouchableHighlight>
                    </View>
                </SafeAreaView>
            </Fragment>
        );
    }
}

export const HomeStyle = StyleSheet.create({
    SafeAreaViewStyle: {
        marginLeft: 25,
        marginRight: 21,
        flex: 1
    },
    PositionedButton: {
        position: "absolute",
        bottom: 0,
        right: 0,
        paddingBottom: 30,
        paddingRight: 31
    }
});
