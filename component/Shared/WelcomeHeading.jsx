import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import ProfileImage from "../../assets/Oval.png";

export default class WelcomeHeading extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        const { children } = this.props;
        return (
            <View style={WelcomeHeadingStyle.View}>
                <Image source={ProfileImage} width="85" height="85" />
                <View style={WelcomeHeadingStyle.ViewForText}>
                    <Text style={WelcomeHeadingStyle.TextBiggerStyle}> Jeffery Holmes </Text>
                    <Text style={WelcomeHeadingStyle.TextSmallerSize}> chill@devshare.biz </Text>
                </View>
            </View>
        );
    }
}

const WelcomeHeadingStyle = StyleSheet.create({
    View: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 72,
        paddingBottom: 50
    },
    Image: {
        borderRadius: 100
    },
    ViewForText: {
        display: "flex",
        flexDirection: "column",
        marginLeft: 30
    },
    TextBiggerStyle: {
        fontSize: 26,
        letterSpacing: 0.52,
        fontWeight: "700"
    },
    TextSmallerSize: {
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 0.32,
        color: "rgba(85, 85, 85, 0.47)"
    }
});
