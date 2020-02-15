import React, { Component } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    Button,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfilePic from "../../assets/Oval.png";
import { HomeStyle } from "../Home/Home";
import { PrimaryColor } from "../../component/Shared/GlobalStyle";
import task from "./TempTasks";
import { connect } from "react-redux";
import { TASKLISTTEXT, USERID, updateTaskList } from "../../redux/Actions";
import { updateReduxState, getMongoDbInstance } from "../../component/Shared/MongoDB";

class Task extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            taskList: this.props.taskList,
            isListEmpty: false,
            userID: this.props.userID
        };
    }
    componentDidMount() {
        const { userID, updateTaskList, taskList } = this.props;
        if (taskList === undefined || taskList === null) {
            updateReduxState(userID, updateTaskList);
        }
        this.props.navigation.addListener("focus", () => {
            this.didFocus();
        });
    }

    didFocus = () => {
        console.log("Focus seen");

        this.setState({ taskList: this.props.taskList }, () => {
            console.log("state after update is : ", this.state);
        });
    };

    render() {
        const { userID, updateTaskList, taskList } = this.props;
        console.log("Render now ", this.props);
        return (
            <SafeAreaView style={HomeStyle.SafeAreaViewStyle}>
                {taskList === undefined || taskList === null ? (
                    <FlatList
                        data={[1, 2, 3, 4, 5, 6]}
                        renderItem={({ item }) => <ActivityIndicator size="large" />}
                        keyExtractor={item => item.toString()}
                        ListHeaderComponent={TaskScreenHead}
                    />
                ) : taskList.length === 0 ? (
                    <EmptyTask />
                ) : (
                    <FlatList
                        data={taskList}
                        renderItem={({ item, index }) => (
                            <FlatListItem
                                item={item}
                                index={index}
                                userID={userID}
                                updateTaskList={updateTaskList}
                            />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        ListHeaderComponent={TaskScreenHead}
                        extraData={this.state.taskList}
                    />
                )}
            </SafeAreaView>
        );
    }
}

class TaskScreenHead extends Component {
    render() {
        return (
            <View style={TaskScreenHeadStyle.View}>
                <Text style={TaskScreenHeadStyle.Text}>My Task</Text>
                <Image source={ProfilePic} />
            </View>
        );
    }
}

export class FlatListItem extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = { cancelButtonState: false };
    }
    componentDidMount() {}
    deleteThisItem = () => {
        this.setState({ cancelButtonState: true });
        const { userID, updateTaskList, index } = this.props;
        const MongoDB = getMongoDbInstance();
        MongoDB.collection("users")
            .findOne({ _id: userID })
            .then(response => {
                const taskList = response.tasks;
                taskList.splice(index, 1);
                MongoDB.collection("users")
                    .updateOne({ _id: userID }, { tasks: taskList })
                    .then(response => {
                        updateReduxState(userID, updateTaskList);
                        this.setState({ cancelButtonState: false });
                    })
                    .catch(err => {
                        console.log("Error updating : ", err);
                    });
            })
            .catch(err => {
                console.log("Error finding the correct task : ", err);
            });
    };

    render() {
        const { item } = this.props;
        return (
            <View style={FlatListItemStyle.OverallView}>
                <View
                    style={{ ...FlatListItemStyle.PaddedView, paddingTop: 15, paddingBottom: 15 }}
                >
                    <Text style={FlatListItemStyle.TaskNameText}> {item.taskTitle} </Text>
                </View>
                <View style={{ ...FlatListItemStyle.borderView, ...FlatListItemStyle.PaddedView }}>
                    <View style={{ marginBottom: 18 }}>
                        <Text style={FlatListItemStyle.DescriptionDetailsHeading}>Description</Text>
                        <Text style={FlatListItemStyle.DescriptionDetailsText}>
                            {item.taskDescription}
                        </Text>
                    </View>
                    <View>
                        <Text style={FlatListItemStyle.DescriptionDetailsHeading}>Deadline</Text>
                        <Text style={FlatListItemStyle.DescriptionDetailsText}>
                            {item.taskDays}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        ...FlatListItemStyle.PaddedView,
                        paddingTop: 10,
                        paddingBottom: 11,
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <View width="50%">
                        <Button title="Accept" color={PrimaryColor} disabled />
                    </View>
                    <TouchableOpacity
                        style={FlatListItemStyle.TransparentButton}
                        onPress={() => {
                            this.deleteThisItem();
                        }}
                    >
                        {this.state.cancelButtonState ? (
                            <ActivityIndicator size="large" />
                        ) : (
                            <Text style={FlatListItemStyle.TransparentButtonText}> Cancel </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

class EmptyTask extends Component {
    render() {
        return (
            <View>
                <Text> You have no task at hand </Text>
            </View>
        );
    }
}

const TaskScreenHeadStyle = StyleSheet.create({
    View: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 15
    },
    Text: {
        fontSize: 30,
        fontWeight: "700",
        letterSpacing: 0.6
    }
});

export const FlatListItemStyle = StyleSheet.create({
    OverallView: {
        display: "flex",
        flexDirection: "column",
        borderStyle: "solid",
        borderWidth: 1,
        marginBottom: 25
    },
    TaskNameText: {
        color: "#000000",
        fontWeight: "700",
        letterSpacing: 0.32,
        fontSize: 20
    },
    borderView: {
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        paddingTop: 26,
        paddingBottom: 23
    },
    PaddedView: {
        paddingLeft: 15,
        paddingRight: 15
    },
    DescriptionDetailsHeading: {
        color: "rgba(0, 0, 0, 0.67)",
        fontSize: 17,
        fontWeight: "700",
        letterSpacing: 0.28,
        marginBottom: 8
    },
    DescriptionDetailsText: {
        color: "rgba(0, 0, 0, 0.4)",
        fontSize: 15,
        fontWeight: "400",
        letterSpacing: 0.26
    },
    TransparentButton: {
        backgroundColor: "transparent",
        // flex: 1
        width: "50%",
        display: "flex",
        alignItems: "center",
        height: 50,
        justifyContent: "center"
    },
    TransparentButtonText: {
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.28
    }
});

const mapStateToProps = state => {
    console.log("state to props : ", state);
    return { userID: state[USERID], taskList: state[TASKLISTTEXT] };
};
const mapDispatchToProps = { updateTaskList };
export default connect(mapStateToProps, mapDispatchToProps)(Task);
