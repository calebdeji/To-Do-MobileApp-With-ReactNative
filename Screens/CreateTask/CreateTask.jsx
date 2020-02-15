import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Button,
    ActivityIndicator
} from "react-native";
import ProfileImage from "../../assets/Oval.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryColor } from "../../component/Shared/GlobalStyle";
import { FlatListItemStyle, FlatListItem } from "../MyTask/Task";
import { Stitch, RemoteMongoClient, UserPasswordCredential } from "mongodb-stitch-react-native-sdk";
import { connect } from "react-redux";
import { getMongoDbInstance, updateReduxState } from "../../component/Shared/MongoDB";
import { USERID, updateTaskList } from "../../redux/Actions";
class CreateTask extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }
    componentDidMount() {
        console.log("Props for Create Task now : ", this.props);
    }
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <CreateTaskHeading />
                <CreateTaskField
                    USERID={this.props.USERID}
                    updateTaskList={this.props.updateTaskList}
                />
            </SafeAreaView>
        );
    }
}

class CreateTaskHeading extends Component {
    render() {
        return (
            <View style={CreateTaskHeadingStyle.OverallView}>
                <View style={CreateTaskHeadingStyle.SubViewWithImage}>
                    <View>
                        <Text
                            style={{
                                fontWeight: "700",
                                fontSize: 40,
                                letterSpacing: 1
                            }}
                        >
                            {" "}
                            Hello{" "}
                        </Text>
                        <Text
                            style={{
                                fontWeight: "700",
                                fontSize: 30,
                                letterSpacing: 1,
                                marginTop: 5
                            }}
                        >
                            {" "}
                            Jeffrey Holmes{" "}
                        </Text>
                    </View>
                    <Image source={ProfileImage} />
                </View>
                <View
                    style={{
                        paddingLeft: 13,
                        paddingRight: 10
                    }}
                >
                    <Text style={{ fontSize: 17 }}> Monday 2, Jan 2020</Text>
                </View>
            </View>
        );
    }
}

class CreateTaskField extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            taskTitle: "",
            taskDescription: "",
            taskDays: "",
            creatingLoading: false
        };
    }
    handleCreateTask = async () => {
        this.setState({ creatingLoading: true });

        const userID = this.props.USERID;
        const mongodb = getMongoDbInstance();
        // console.log(object);+
        mongodb
            .collection("users")
            .findOne({ _id: userID })
            .then(async response => {
                if (response === null) {
                    console.log("Null response ", response);
                    this.createNewDocument(this.state);
                } else {
                    console.log("Response : ");
                    await this.updateTasks();
                }
                this.setState(
                    {
                        creatingLoading: false,
                        taskTitle: "",
                        taskDescription: "",
                        taskDays: ""
                    },
                    () => {
                        alert("Task created successfully");
                    }
                );
            })
            .catch(err => {
                console.log("eroor catching user id : ", err);
            });
    };

    createNewDocument = ({ taskTitle, taskDescription, taskDays: daysToParse }) => {
        const mongodb = getMongoDbInstance();
        const userID = this.props.USERID;
        const updateTaskList = this.props.updateTaskList;
        const taskDays = this.parseNumberOfDaysToDate(daysToParse);
        console.log("user id ", userID);

        mongodb
            .collection("users")
            .insertOne({
                _id: userID,
                tasks: [{ taskTitle, taskDescription, taskDays }]
            })
            .then(response => {
                console.log("First doc created ", response);
                updateReduxState(userID, updateTaskList);
            })
            .catch(err => {
                console.log("Error creating first doc ", err);
            });
    };
    updateTasks = async () => {
        const mongodb = getMongoDbInstance();
        const userID = this.props.USERID;
        const updateTaskList = this.props.updateTaskList;
        const { taskTitle, taskDescription, taskDays: daysToParse } = this.state;
        const taskDays = this.parseNumberOfDaysToDate(daysToParse);
        try {
            const previousTasks = await mongodb.collection("users").findOne({ _id: userID });
            mongodb
                .collection("users")
                .findOneAndUpdate(
                    { _id: userID },
                    {
                        tasks: [...previousTasks.tasks, { taskTitle, taskDescription, taskDays }]
                    }
                )
                .then(response => {
                    console.log("task updated : ");
                    updateReduxState(userID, updateTaskList);
                })
                .catch(err => {
                    console.log("Task not updated : ", err);
                });
        } catch (error) {
            console.log("Previous tasks not updated : ", error);
        }
    };
    parseNumberOfDaysToDate = numberOfDays => {
        const dateObject = new Date();
        const todayDate = new Date().getDate();
        const deadlineDays = Number(numberOfDays) + Number(todayDate);
        dateObject.setDate(deadlineDays);
        console.log(
            `date object is ${dateObject.toDateString()} and today date ${todayDate} and deadlineDays = ${Number(
                numberOfDays
            ) + Number(todayDate)}`
        );
        return dateObject.toDateString();
    };
    render() {
        const { TransparentButton, TransparentButtonText } = FlatListItemStyle;
        return (
            <View style={CreateTaskFieldStyle.OverallView}>
                <Text style={CreateTaskFieldStyle.Text}> Create Task </Text>
                <View style={CreateTaskFieldStyle.InputView}>
                    <TextInput
                        placeholder="Taskname"
                        value={this.state.taskTitle}
                        onChangeText={newValue => {
                            this.setState({ taskTitle: newValue });
                        }}
                    />
                </View>
                <View
                    style={{
                        ...CreateTaskFieldStyle.InputView,
                        height: 100,
                        justifyContent: "flex-start"
                    }}
                >
                    <TextInput
                        placeholder="Description"
                        multiline={true}
                        value={this.state.taskDescription}
                        onChangeText={newValue => {
                            this.setState({ taskDescription: newValue });
                        }}
                    />
                </View>
                <View style={CreateTaskFieldStyle.InputView}>
                    <TextInput
                        placeholder="Number of Days"
                        value={this.state.taskDays}
                        onChangeText={newValue => {
                            this.setState({ taskDays: newValue });
                        }}
                        keyboardType="phone-pad"
                    />
                </View>
                <View style={CreateTaskFieldStyle.ButtonContainer}>
                    <View
                        style={{
                            width: "30%",
                            backgroundColor: PrimaryColor,
                            elevation: 5,
                            height: 50,
                            borderRadius: 10,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                this.handleCreateTask();
                            }}
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: PrimaryColor
                            }}
                        >
                            {this.state.creatingLoading ? (
                                <ActivityIndicator size="large" />
                            ) : (
                                <Text>Create</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={TransparentButton}>
                        <Text style={TransparentButtonText}> Cancel </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const CreateTaskHeadingStyle = StyleSheet.create({
    OverallView: {
        paddingBottom: 20,
        paddingTop: 15,
        display: "flex",
        flexDirection: "column",
        backgroundColor: " rgba(80, 59, 255, 0)",
        flex: 1
    },
    SubViewWithImage: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
        paddingLeft: 10,
        paddingRight: 10
    }
});

const CreateTaskFieldStyle = StyleSheet.create({
    OverallView: {
        flex: 3,
        backgroundColor: "#ffffff",
        paddingTop: 68,
        paddingBottom: 20,
        paddingLeft: 19,
        paddingRight: 19,
        display: "flex",
        flexDirection: "column"
    },
    InputView: {
        borderStyle: "solid",
        borderRadius: 4,
        height: 50,
        borderWidth: 2,
        borderColor: "rgba(151, 151, 151, 0.1)",
        marginTop: 23,
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: "center"
    },
    ButtonContainer: {
        flex: 1,
        alignItems: "flex-end",
        justifyContent: "flex-end",
        flexDirection: "row",
        paddingBottom: 30
    },
    Text: {
        fontSize: 21,
        fontWeight: "700",
        letterSpacing: 0.32,
        marginBottom: 3
    }
});

const mapStateToProps = state => {
    return { [USERID]: state[USERID] };
};

const mapDispatchToProps = { updateTaskList: updateTaskList };
export default connect(mapStateToProps, mapDispatchToProps)(CreateTask);
