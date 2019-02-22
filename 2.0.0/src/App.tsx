import "./App.css";
import * as React from "react";

import {BrowserRouter} from "react-router-dom";
import {Route, Switch} from "react-router";
import {HomePage} from "./HomePage";
import {RoomPage} from "./RoomPage";
import {SlicePage} from "./SlicePage";

export const App: React.FunctionComponent = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={HomePage}/>
            <Route exact path="/room/:uuid" component={RoomPage}/>
            <Route exact path="/replay/:uuid" component={SlicePage}/>
            <Route component={NotFoundPage}/>
        </Switch>
    </BrowserRouter>
);

const NotFoundPage: React.FunctionComponent = () => (
    <div>404 not found</div>
);
