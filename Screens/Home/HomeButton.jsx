import React, { Component } from "react";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";

export default class HomeButton extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        return (
            <TouchableHighlight
                style={HomeButtonStyle.transparent}
                onPress={() => {
                    this.props.navigateToTabs();
                }}
            >
                <View>{this.props.children}</View>
            </TouchableHighlight>
        );
    }
}

const HomeButtonStyle = StyleSheet.create({
    transparent: {
        backgroundColor: "transparent",
        marginTop: 50,
        display: "flex",
        justifyContent: "center",
        height: 50
    }
});
