import { csrfFetch } from "./csrf";
const VIEW_ALL_GROUPS = "groups/ViewAllGroups";
const VIEW_SINGLE_GROUP = "groups/ViewSingleGroup";
const CREATE_GROUP = "groups/createGroup";
const DELETE_GROUP = "groups/deleteGroup";
const UPDATE_GROUP = "groups/updateGroup";


function GetAllGroups(groups) {
    return {
        type: VIEW_ALL_GROUPS,
        payload: groups,
    };
}

function createGroup(group) {
    return {
        type: CREATE_GROUP,
        payload: group,
    };
}

function GetSingleGroup(group) {
    return {
        type: VIEW_SINGLE_GROUP,
        payload: group,
    };
}

function deleteGroup(group) {
    return {
        type: DELETE_GROUP,
        payload: group,
    };
}

function updateGroup(group) {
    return {
        type: UPDATE_GROUP,
        payload: group,
    };
}

const initialState = { allGroups: {}, singleGroup: {} };
export const ViewAllGroupsThunk = () => {
    return async (dispatch) => {
        try {
            const res = await csrfFetch("/api/groups");
            const data = await res.json();
            console.log("data", data);

            dispatch(GetAllGroups(data.Groups));
            return data.Groups;
        } catch (error) {
        }
    };
};

export const ViewSingleGroupThunk = (groupId) => {
    return async (dispatch) => {
        try {
            const res = await fetch(`/api/groups/${groupId}`);
            if (!res.ok) {
                throw new Error("Failed to fetch group data.");
            }

            const group = await res.json();
            console.log("group", group);
            dispatch(GetSingleGroup(group));
            return group;
        } catch (error) {
            console.error(error);
        }
    };
};

export function deleteGroupThunk(groupToDelete) {
    console.log(groupToDelete);
    return async function (dispatch) {
        try {
            const res = await csrfFetch(`/api/groups/${groupToDelete.id}`, {
                method: "DELETE",
            });

            const message = await res.json();
            dispatch(deleteGroup(groupToDelete));

            return message;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
}

export const updateGroupThunk = (group, image) => {
    return async (dispatch) => {
        try {
            const res = await csrfFetch(`/api/groups/${group.id}`, {
                method: "PUT",
                body: JSON.stringify(group),
            });

            if (res.ok) {
                const newGroup = await res.json();
                dispatch(updateGroup(newGroup));
                return newGroup;
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    };
};

export const createGroupThunk = (group, image) => {
    return async (dispatch) => {
        try {
            const res = await csrfFetch("/api/groups", {
                method: "POST",
                body: JSON.stringify(group),
            });
            const newGroup = await res.json();

            if (res.ok) {
                dispatch(createGroup(newGroup));
            }
            return newGroup;
        } catch (error) {
            console.log(error);
            return error;
        }
    };
};

const groupsReducer = (state = initialState, action) => {
    switch (action.type) {
      case VIEW_ALL_GROUPS: {
        return {
          ...state,
          allGroups: action.payload,
        };
      }
      case UPDATE_GROUP: {
        return {
          ...state,
          singleGroup: action.payload,
        };
      }
      case CREATE_GROUP: {
        return {
          ...state,
          singleGroup: action.payload,
        };
      }
      case VIEW_SINGLE_GROUP: {
        return {
          ...state,
          singleGroup: action.payload,
        };
      }
      case DELETE_GROUP: {
        const newAllGroups = { ...state.allGroups };
        delete newAllGroups[action.payload.id];

        return {
          ...state,
          allGroups: newAllGroups,
          singleGroup: {},
        };
      }
      default:
        return state;
    }
  };









export default groupsReducer
