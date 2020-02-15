import { USERID } from "./Actions";
import { TASKLISTTEXT } from "./Actions";

const initialState = {
    [USERID]: ""
};

export const userIDReducer = (state = initialState, actions) => {
    switch (actions.type) {
        case USERID:
            console.log("User id seen ", actions);
            return { ...state, [USERID]: actions[USERID] };

        case TASKLISTTEXT:
            console.log("TasklistText seen : ", actions[TASKLISTTEXT].tasks);
            return { ...state, [TASKLISTTEXT]: actions[TASKLISTTEXT].tasks };
        default:
            return { ...state };
    }
};
