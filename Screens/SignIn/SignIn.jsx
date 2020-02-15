import React, { Component } from "react";
import {
    View,
    Text,
    KeyboardAvoidingView,
    AsyncStorage,
    TextInput,
    CheckBox,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import SafeAreaAuthView, {
    AuthOverallView,
    ViewFlex1,
    CustomFontAwesomeIcon
} from "../../component/AuthComponent/SafeAreaAuthView";
import {
    ViewStyle,
    TextStyle,
    ButtonStyle
} from "../../component/AuthComponent/AuthComponentStyle";

import { USERID } from "../../redux/Actions";
import { saveUserId } from "../../redux/Actions";
import { connect } from "react-redux";
import { faFacebook, faGooglePlus, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Stitch, UserPasswordCredential } from "mongodb-stitch-react-native-sdk";
class SignIn extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            signUp: {
                userEmail: "",
                userPassword: ""
            },
            signInLoading: false,
            rememberMe: true
        };
    }

    componentDidMount() {
        // console.log("Mounted", this.props.navigation);
        this.props.navigation.addListener("focus", () => {
            this.didFocus();
        });
    }

    didFocus = async () => {
        try {
            await AsyncStorage.getItem("user").then(user => {
                console.log("user : ", user);
                const parseUser = JSON.parse(user);
                const { userEmail, userPassword } = parseUser;
                this.setState({ signUp: { userEmail, userPassword } });
            });
        } catch (error) {
            console.log("Async Storage unable to receive keys", error);
        }
    };
    handleSignIn = () => {
        this.setState({ signInLoading: true });
        const { userEmail, userPassword } = this.state.signUp;
        const app = Stitch.defaultAppClient;
        const credential = new UserPasswordCredential(userEmail, userPassword);
        if (userEmail.trim() && userPassword.trim()) {
            app.auth
                .loginWithCredential(credential)
                // Returns a promise that resolves to the authenticated user
                .then(authedUser => {
                    console.log(`successfully logged in with id: ${authedUser.id}`);
                    this.props.saveUserId(authedUser.id);
                    // this.createCollectionIfNotExist(authedUser.id);
                    this.props.navigation.navigate("Home");

                    this.setState({ signInLoading: false });
                })
                .catch(err => {
                    console.error(`login failed with error: ${err}`);
                    this.setState({ signInLoading: false });
                });
        } else {
            alert("All fields required");
        }
    };
    createCollectionIfNotExist = id => {
        // const stitchClient = Stitch.getAppClient();
        // const mongodb = stitchClient.getServiceClient(RemoteMongoClient.factory, "mongodb-atlas");
        // const task = mongodb.db("ToDo").collection(id);
    };
    saveUserCredentials = async status => {
        if (status) {
            try {
                const { userEmail, userPassword } = this.state.signUp;
                const userStrignified = JSON.stringify({ userEmail, userPassword });
                await AsyncStorage.setItem("user", userStrignified);
                console.log("Save user");
            } catch (error) {
                console.log("Async Storage unable to set item", error);
            }
        } else {
            try {
                await AsyncStorage.removeItem("user").then(() => {
                    console.log("User details removed from asyncstorage");
                });
            } catch (error) {
                console.log("Unable to remove user details from asyncstorage", error);
            }
        }
    };

    rememberMe = async () => {
        console.log("Remember me beginning : ", this.state);
        this.setState(
            state => ({
                ...state,
                rememberMe: !state.rememberMe
            }),
            state => {
                const { rememberMe } = this.state;
                this.saveUserCredentials(rememberMe);
            }
        );
    };
    handleChange = (stateName, value) => {
        this.setState(state => ({
            ...state,
            signUp: { ...state.signUp, [stateName]: value }
        }));
    };
    render() {
        const { userEmail, userPassword } = this.state.signUp;
        const { rememberMe } = this.state;
        return (
            <SafeAreaAuthView>
                {/* <KeyboardAvoidingView behavior="padding"> */}
                <AuthOverallView>
                    <View style={{ flex: 1.2 }}>
                        <Text style={TextStyle.screenTitle}> Sign Up</Text>
                    </View>
                    <ViewFlex1>
                        <TextInput
                            style={ViewStyle.TextInputView}
                            placeholder="@johndoe@gmail.com"
                            placeholderTextColor="rgb(144, 144, 144)"
                            value={userEmail}
                            autoCompleteType="email"
                            keyboardType="email-address"
                            onChangeText={value => {
                                this.handleChange("userEmail", value);
                            }}
                        />
                    </ViewFlex1>
                    <ViewFlex1>
                        <TextInput
                            style={ViewStyle.TextInputView}
                            placeholder="**********"
                            placeholderTextColor="rgb(144, 144, 144)"
                            value={userPassword}
                            onChangeText={value => {
                                this.handleChange("userPassword", value);
                            }}
                            keyboardType="default"
                            secureTextEntry={true}
                        />
                    </ViewFlex1>
                    <View
                        style={{
                            ...ViewStyle.ViewWithFlex1,
                            ...ViewStyle.ViewWithRowDirection,
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <View style={{ ...ViewStyle.ViewWithRowDirection, alignItems: "center" }}>
                            <CheckBox
                                value={rememberMe}
                                onValueChange={() => {
                                    this.rememberMe();
                                }}
                            />
                            <Text
                                style={{
                                    ...TextStyle.FooterText,
                                    ...TextStyle.GreyColorText
                                }}
                            >
                                Remember Me
                            </Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={{ ...TextStyle.GreyColorText }}>Forgot Password ?</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={ViewStyle.ViewWithFlex1}>
                        <TouchableOpacity
                            style={ButtonStyle.authButton}
                            onPress={this.handleSignIn}
                        >
                            {this.state.signInLoading ? (
                                <ActivityIndicator />
                            ) : (
                                <Text style={TextStyle.AuthText}> Sign In </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            ...ViewStyle.ViewWithFlex1,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Text style={TextStyle.GreyColorText}>or</Text>
                    </View>
                    <View
                        style={{
                            ...ViewStyle.ViewWithRowDirection,
                            justifyContent: "space-around",
                            alignSelf: "center",
                            width: "60%"
                        }}
                    >
                        <CustomFontAwesomeIcon icon={faFacebook} />
                        <CustomFontAwesomeIcon icon={faGooglePlus} />
                        <CustomFontAwesomeIcon icon={faTwitter} />
                    </View>
                    <View
                        style={{
                            ...ViewStyle.ViewWithRowDirection,
                            flex: 3,
                            alignSelf: "center",
                            alignItems: "flex-end"
                        }}
                    >
                        <Text
                            style={{
                                ...TextStyle.FooterText,
                                ...TextStyle.GreyColorText
                            }}
                        >
                            Don't have an account?{"  "}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.navigateToSignInPage();
                            }}
                        >
                            <Text
                                style={{
                                    ...TextStyle.FooterText,
                                    ...TextStyle.PrimaryColorText
                                }}
                            >
                                Create new one
                            </Text>
                        </TouchableOpacity>
                    </View>
                </AuthOverallView>
                {/* </KeyboardAvoidingView> */}
            </SafeAreaAuthView>
        );
    }
}

const mapStateToProps = state => {
    return { userId: state[USERID] };
};

const mapDispatchToProps = {
    saveUserId
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
