import { csrfFetch } from "./csrf";

const GET_ALL_EVENTS = "events/getAllEvents";
const CREATE_EVENT = "events/createEvent";
const GET_SINGLE_EVENT = "events/getSingleEvent";
const DELETE_EVENT = "events/deleteEvent";
const SAVE_EVENT_IMAGE = 'events/saveEventImage'
const getAllEvents = (events) => {
  return {
    type: GET_ALL_EVENTS,
    payload: events,
  };
};

const getSingleEvent = (event) => {
  return {
    type: GET_SINGLE_EVENT,
    payload: event,
  };
};

const createEvent = (event) => {
  return {
    type: CREATE_EVENT,
    payload: event,
  };
};

const deleteEvent = (eventToDelete) => {
  return {
    type: DELETE_EVENT,
    payload: eventToDelete,
  };
};

export const saveEventImage = (imgUrl) => {
  return {
    type: SAVE_EVENT_IMAGE,
    payload: imgUrl,
  }
}
export const getAllEventsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/events");
  console.log(res);
  if (res.ok) {
    const events = await res.json();
    console.log("events", events);
    dispatch(getAllEvents(events.Events));
    return events;
  }
};
export const getSingleEventThunk = (eventId) => async (dispatch) => {

  try {
    const res = await csrfFetch(`/api/events/${eventId}`);
// console.log('eventtttt', eventId)
    if (res.ok) {
      const event = await res.json();
      dispatch(getSingleEvent(event));
      return event;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};
export const createEventThunk = (event) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/groups/${event.groupId}/events`, {
      method: "POST",
      body: JSON.stringify(event),
    });
    console.log(`/api/groups/${event.groupId}/events`);

    if (res.ok) {
      const newEvent = await res.json();

      dispatch(createEvent(newEvent));

      return newEvent;
    }
  } catch (err) {
    const error = await err.json();
    console.log(error);
    return error;
  }
};

export const deleteEventThunk = (eventToDelete) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/events/${eventToDelete.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      const message = await res.json();
      dispatch(deleteEvent(eventToDelete));
      console.log(message);
      return message;
    }
  } catch (err) {
    console.log(err);
    return err;
  }
};


const initialState = { allEvents: [], singleEvent: {}, eventImgUrl: ""};

const eventsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_EVENTS: {
      const newState = { ...state };
      newState.allEvents = action.payload;
      return newState;
    }
    case GET_SINGLE_EVENT:
      return {
        ...state,
        singleEvent: action.payload,
      };
      case SAVE_EVENT_IMAGE:
      return {
        ...state,
        eventImgUrl: action.payload,
      };
    case CREATE_EVENT:
      return {
        ...state,
        allEvents: [...state.allEvents, action.payload],
      };
    case DELETE_EVENT:
      const newState = {
        ...state,
        allEvents: [...state.allEvents],
        singleEvent: {},
      };
      delete newState.allEvents[action.payload.id];
      return newState;
    default:
      return state;
  }

};

export default eventsReducer;
