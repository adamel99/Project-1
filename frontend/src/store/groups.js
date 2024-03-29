import { csrfFetch } from "./csrf";
const VIEW_ALL_GROUPS = "groups/ViewAllGroups";
const VIEW_SINGLE_GROUP = "groups/ViewSingleGroup";
const CREATE_GROUP = "groups/createGroup";
const DELETE_GROUP = "groups/deleteGroup";
const UPDATE_GROUP = "groups/updateGroup";
const CREATE_GROUP_IMAGE = 'groups/createGroupImage'
const STORE_GROUP_EVENTS = 'events/storeGroupEvents'

function storeGroupEvents(events) {
  return {
    type: STORE_GROUP_EVENTS,
    payload: events
  }
}
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

function getSingleGroup(group) {
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

const createGroupImage = (preview) => ({
  type: CREATE_GROUP_IMAGE,
  payload: preview,
});


const initialState = { allGroups: {}, singleGroup: { events: [] } };
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

export const ViewSingleGroupThunk = (groupId) => async (dispatch) => {
  try {
    const res = await fetch(`/api/groups/${groupId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch group data.");
    }

    const group = await res.json();
    const eventsRes = await fetch(`/api/groups/${groupId}/events`);
    const events = await eventsRes.json();

    dispatch(getSingleGroup(group));
    dispatch(storeGroupEvents(events.Events));

    return group;
  } catch (error) {
    console.error(error);
  }
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

export const updateGroupThunk = (group) => {
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

export const createGroupThunk = (group) => {
  return async (dispatch) => {
    try {
      const imageURL = group.preview;
      const res = await csrfFetch("/api/groups", {
        method: "POST",
        body: JSON.stringify(group),
      });

      if (res.ok) {
        const newGroup = await res.json();
        newGroup.preview = imageURL;
        dispatch(createGroup(newGroup));
        return newGroup;
      } else {

        const errorData = await res.json();
        throw new Error(errorData.message);
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  };
};

  // create group images thunk
  export const createGroupImagesThunk = (groupId, preview) => async (dispatch) => {
    console.log('groupId', groupId)
    console.log('preview object', preview)
    const imgRes = await csrfFetch(`/api/groups/${groupId}/images`, {
      method: "POST",
      body: JSON.stringify(preview),
    });
    console.log('a string', preview)

  if (imgRes.ok) {
    const img = await imgRes.json();
    dispatch(createGroupImage(preview));
    return img;
  }
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
        const newState = { ...state };
        newState.singleGroup = action.payload;
        return newState;
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
          singleGroup: {
            ...state.singleGroup,
            ...action.payload,
          },
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
      case STORE_GROUP_EVENTS: {
        return {
          ...state,
          singleGroup: {
            ...state.singleGroup,
            events: action.payload
          }
        }
      }
      default:
        return state;
    }
  };









export default groupsReducer
