export const USERID = "USERID";
export const TASKLISTTEXT = "TASKLIST";
export const saveUserId = userID => {
    return { type: USERID, [USERID]: userID };
};
export const updateTaskList = taskList => {
    console.log("tasklist : ", taskList);
    return { type: TASKLISTTEXT, [TASKLISTTEXT]: taskList };
};
