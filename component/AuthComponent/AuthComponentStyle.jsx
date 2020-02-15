import { StyleSheet, Platform, StatusBar, SafeAreaView, PixelRatio } from "react-native";
import { PrimaryColor, WhiteColor, greyColor } from "../Shared/GlobalStyle";

export const ViewStyle = StyleSheet.create({
    OverallView: {
        flex: 1,
        width: "80%",
        display: "flex",
        flexDirection: "column"
    },
    SafeAreaView: {
        paddingTop: 100,
        paddingBottom: 100,
        display: "flex",
        alignItems: "center",
        flex: 1,
        width: "100%",
        backgroundColor: "rgba(12, 12, 24, 0.938)"
    },
    TextInputView: {
        borderWidth: 1,
        borderRadius: 30,
        backgroundColor: "rgba(21, 21, 22, 0.938)",
        borderColor: "transparent",
        color: WhiteColor,
        paddingLeft: 20,
        paddingRight: 20,
        height: 70
    },
    TouchableHighlight: {
        backgroundColor: PrimaryColor,
        borderRadius: 10
    },
    ViewWithFlex1: {
        flex: 1
    },
    ViewWithRowDirection: {
        display: "flex",
        flexDirection: "row"
    }
});
export const TextStyle = StyleSheet.create({
    screenTitle: {
        fontSize: 30,
        color: WhiteColor,
        fontWeight: "bold"
    },
    Agreement: {
        color: "rgb(144, 144, 144)",
        fontSize: 17,
        marginLeft: 10,
        lineHeight: 30
    },
    AuthText: {
        color: "rgba(21, 21, 22, 0.938)",
        fontSize: 25
    },
    FooterText: {
        fontSize: 17
    },
    PrimaryColorText: {
        color: PrimaryColor
    },
    GreyColorText: {
        color: greyColor
    },
    TextIcon: {
        color: "white"
    }
});
export const ButtonStyle = StyleSheet.create({
    authButton: {
        borderRadius: 50,
        backgroundColor: PrimaryColor,
        width: "100%",
        height: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
});
