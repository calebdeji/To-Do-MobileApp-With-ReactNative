import React, { Component } from "react";
import { SafeAreaView, View, Text, TouchableHighlight } from "react-native";
import { ViewStyle, TextStyle } from "./AuthComponentStyle";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
export default class SafeAreaAuthView extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        return <SafeAreaView style={ViewStyle.SafeAreaView}>{this.props.children}</SafeAreaView>;
    }
}

export class AuthOverallView extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        const { children } = this.props;
        return <View style={ViewStyle.OverallView}>{children}</View>;
    }
}

export class ViewFlex1 extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        const { children } = this.props;
        return <View style={ViewStyle.ViewWithFlex1}>{children}</View>;
    }
}

export class CustomFontAwesomeIcon extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    render() {
        return (
            <TouchableHighlight>
                <Text>
                    <FontAwesomeIcon icon={this.props.icon} size={50} style={TextStyle.TextIcon} />;
                </Text>
            </TouchableHighlight>
        );
    }
}
