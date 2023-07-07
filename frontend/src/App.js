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
          <Route exact path="/groups">
            <ViewAllGroups />
          </Route>
          <Route exact path="/groups/new">
            <CreateGroupsForm />
          </Route>
          <Route exact path="/groups/:groupId">
            <GroupDetails />
          </Route>
          <Route path="/groups/:groupId/edit">
            <UpdateGroup />
          </Route>
        </Switch>}
    </>
  );
}

export default App;
