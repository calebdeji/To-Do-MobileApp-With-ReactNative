import React, { Component } from "react";

import { Stitch, RemoteMongoClient, UserPasswordCredential } from "mongodb-stitch-react-native-sdk";
import { connect } from "react-redux";
import { USERID, updateTaskList } from "../../redux/Actions";
export const getMongoDbInstance = () => {
    const stitchClient = Stitch.getAppClient("todo_app-ruzzq");
    const mongodb = stitchClient
        .getServiceClient(RemoteMongoClient.factory, "mongodb-atlas")
        .db("ToDo");
    return mongodb;
};

export const updateReduxState = async (userID, updateTaskList) => {
    const mongodb = getMongoDbInstance();
    mongodb
        .collection("users")
        .findOne({ _id: userID })
        .then(response => {
            updateTaskList(response);
            console.log("Updated redux state : ", response);
        });
};
