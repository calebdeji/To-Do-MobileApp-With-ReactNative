import React, { Component } from "react";
import {
    View,
    Text,
    ScrollView,
    TextInput,
    CheckBox,
    TouchableHighlight,
    SafeAreaView,
    KeyboardAvoidingView,
    ActivityIndicator,
    StatusBar,
    AsyncStorage
} from "react-native";
import { Linking } from "expo";
import {
    ViewStyle,
    TextStyle,
    ButtonStyle
} from "../../component/AuthComponent/AuthComponentStyle";
import SafeAreaAuthView, {
    AuthOverallView,
    ViewFlex1
} from "../../component/AuthComponent/SafeAreaAuthView";
import {
    Stitch,
    RemoteMongoClient,
    FunctionCredential,
    UserPasswordAuthProviderClient
} from "mongodb-stitch-react-native-sdk";
// import { URLSearchParams } from "url";

export default class SignUp extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            signUp: {
                userName: "",
                userEmail: "",
                userPassword: "",
                userPasswordConfirmation: "",
                consentAgreement: false
            },
            signUpFieldValidated: true,
            signUpFiledNotValidatedErrorMessage: "",
            signUpLoading: false
        };
    }

    handleChange = (stateProperty, value) => {
        this.setState(state => ({
            ...state,
            signUp: {
                ...state.signUp,
                [stateProperty]: value
            }
        }));
    };

    handleConsentAgreement = () => {
        this.setState(state => ({
            ...state,
            signUp: {
                ...state.signUp,
                consentAgreement: !state.signUp.consentAgreement
            }
        }));
    };
    handleSignUp = () => {
        this.setState({ signUpLoading: true });
        const stateSignUp = this.state.signUp;
        const stateSignUpKeys = Object.keys(this.state.signUp);
        let testCase = true;
        for (let keyIndex = 0; keyIndex < stateSignUpKeys.length; keyIndex++) {
            // console.log("For loop seen");
            if (!stateSignUp[stateSignUpKeys[keyIndex]]) {
                this.toggleSignUpFieldValidatedState(false);
                this.setState({
                    signUpFiledNotValidatedErrorMessage: `${stateSignUpKeys[keyIndex]} is empty`
                });
                alert(`${stateSignUpKeys[keyIndex]} is empty`);
                break;
            } else {
                const { userPassword, userPasswordConfirmation, userEmail } = this.state.signUp;
                switch (stateSignUpKeys[keyIndex]) {
                    case "userEmail":
                        const regularExpressionForEmailValidation = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                        const isEmailValid = regularExpressionForEmailValidation.test(userEmail);
                        if (isEmailValid) {
                            this.toggleSignUpFieldValidatedState(true);
                        } else {
                            this.toggleSignUpFieldValidatedState(false);

                            alert("Enter a valid email address");
                        }
                        break;
                    case "userPassword":
                        if (userPassword === userPasswordConfirmation) {
                            this.toggleSignUpFieldValidatedState(true);
                        } else {
                            this.toggleSignUpFieldValidatedState(false);

                            alert("Passwords don't match");
                        }

                        break;
                    default:
                        break;
                }
            }
        }
        if (testCase) {
            const { userEmail, userPassword } = this.state.signUp;
            const emailPasswordClient = Stitch.getAppClient(
                "todo_app-ruzzq"
            ).auth.getProviderClient(UserPasswordAuthProviderClient.factory);
            emailPasswordClient
                .registerWithEmail(userEmail, userPassword)
                .then(async successMessage => {
                    console.log("successfully sent account confirmation email", successMessage);
                    alert("Account Created");
                    const account = JSON.stringify({ userEmail, userPassword });
                    console.log("account : ", account);
                    try {
                        await AsyncStorage.setItem("user", account);
                        console.log("Account details set locally");
                        this.setState({ signUpLoading: false });
                    } catch (error) {
                        console.log("unable to set account details locally");
                    }
                    this.navigateToSignInPage();
                })
                .catch(err => {
                    console.log("Error registering new user : ", err);
                    this.setState({ signUpLoading: false });
                });
        }
        console.log("State is : ", this.state);
    };
    toggleSignUpFieldValidatedState = status => {
        this.setState({ signUpFieldValidated: status });
    };
    navigateToSignInPage = () => {
        this.props.navigation.navigate("SignIn");
    };
    componentDidMount() {
        Stitch.initializeDefaultAppClient("todo_app-ruzzq");
    }
    render() {
        const { signUp } = this.state;
        return (
            <SafeAreaAuthView>
                <KeyboardAvoidingView behavior="padding">
                    <AuthOverallView>
                        <View style={{ flex: 1.2 }}>
                            <Text style={TextStyle.screenTitle}> Sign Up</Text>
                        </View>
                        <ViewFlex1>
                            <TextInput
                                style={ViewStyle.TextInputView}
                                placeholder="@john_doe"
                                placeholderTextColor="rgb(144, 144, 144)"
                                value={signUp.userName}
                                autoCompleteType="username"
                                onChangeText={value => {
                                    this.handleChange("userName", value);
                                }}
                            />
                        </ViewFlex1>
                        <View style={ViewStyle.ViewWithFlex1}>
                            <TextInput
                                style={ViewStyle.TextInputView}
                                placeholder="@johndoe@gmail.com"
                                placeholderTextColor="rgb(144, 144, 144)"
                                value={signUp.userEmail}
                                autoCompleteType="email"
                                keyboardType="email-address"
                                onChangeText={value => {
                                    this.handleChange("userEmail", value);
                                }}
                            />
                        </View>
                        <View style={ViewStyle.ViewWithFlex1}>
                            <TextInput
                                style={ViewStyle.TextInputView}
                                placeholder="**********"
                                placeholderTextColor="rgb(144, 144, 144)"
                                value={signUp.userPassword}
                                onChangeText={value => {
                                    this.handleChange("userPassword", value);
                                }}
                                keyboardType="default"
                                secureTextEntry={true}
                            />
                        </View>
                        <View style={ViewStyle.ViewWithFlex1}>
                            <TextInput
                                style={ViewStyle.TextInputView}
                                placeholder="********"
                                placeholderTextColor="rgb(144, 144, 144)"
                                value={signUp.userPasswordConfirmation}
                                onChangeText={value => {
                                    this.handleChange("userPasswordConfirmation", value);
                                }}
                                keyboardType="default"
                                secureTextEntry={true}
                            />
                        </View>
                        <View
                            style={{
                                ...ViewStyle.ViewWithFlex1,
                                ...ViewStyle.ViewWithRowDirection
                            }}
                        >
                            <CheckBox
                                value={signUp.consentAgreement}
                                onValueChange={() => {
                                    this.handleConsentAgreement();
                                }}
                            />
                            <Text style={TextStyle.Agreement}>
                                By Signing up you accept the{" "}
                                <Text
                                    style={{
                                        ...TextStyle.PrimaryColorText,
                                        fontSize: 20
                                    }}
                                >
                                    {" "}
                                    Term of service
                                </Text>{" "}
                                and{" "}
                                <Text
                                    style={{
                                        ...TextStyle.PrimaryColorText,
                                        fontSize: 20
                                    }}
                                >
                                    {" "}
                                    Privacy Policy
                                </Text>
                            </Text>
                        </View>
                        <View style={ViewStyle.ViewWithFlex1}>
                            <TouchableHighlight
                                style={ButtonStyle.authButton}
                                onPress={this.handleSignUp}
                            >
                                {this.state.signUpLoading ? (
                                    <ActivityIndicator />
                                ) : (
                                    <Text style={TextStyle.AuthText}> Sign Up </Text>
                                )}
                            </TouchableHighlight>
                        </View>
                        <View
                            style={{
                                ...ViewStyle.ViewWithFlex1,
                                ...ViewStyle.ViewWithRowDirection,
                                justifyContent: "center"
                            }}
                        >
                            <Text
                                style={{
                                    ...TextStyle.FooterText,
                                    color: "white"
                                }}
                            >
                                Already have an account?{" "}
                            </Text>
                            <TouchableHighlight
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
                                    Sign In
                                </Text>
                            </TouchableHighlight>
                        </View>
                    </AuthOverallView>
                </KeyboardAvoidingView>
            </SafeAreaAuthView>
        );
    }
}
