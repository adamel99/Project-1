import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { Route } from 'react-router-dom'
import ViewAllGroups from "./components/ViewAllGroups/ViewAllGroups";
import CreateGroupsForm from "./components/CreateGroupsForm/CreateGroupsForm";
import GroupDetails from "./components/GroupDetails/GroupDetails";
import LandingPage from "./components/LandingPage/LandingPage";
import UpdateGroup from "./components/UpdateGroup/UpdateGroup";
import ManageGroup from "./components/ManageGroup/ManageGroup";
import EventDetails from "./EventDetails/EventDetails";
import EventList from "./components/EventList/EvenList";
import EventCreator from "./components/CreateEvent/CreateEvent";


function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded &&
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route exact path="/groups/new">
            <CreateGroupsForm />
          </Route>
          <Route exact path="/groups">
            <ViewAllGroups />
          </Route>
          <Route path="/groups/current">
            <ManageGroup />
          </Route>
          <Route exact path="/groups/:groupId">
            <GroupDetails />
          </Route>
          <Route exact path="/groups/:groupId/edit">
            <UpdateGroup />
          </Route>
          <Route path="/groups/:groupId/events/new">
            <EventCreator />
          </Route>
          <Route path="/events/:eventId">
            <EventDetails />
          </Route>
          <Route exact path="/events">
            <EventList />
          </Route>
        </Switch>}
    </>
  );
}

export default App;
