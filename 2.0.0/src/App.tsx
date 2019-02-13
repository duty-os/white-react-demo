import * as React from "react";

import {BrowserRouter} from "react-router-dom";
import {Route, Switch} from "react-router";
import {HomePage} from "./HomePage";

export const App: React.FunctionComponent = () => (
    <BrowserRouter>
        <Switch>
            <Route extract path="/" component={HomePage}/>
        </Switch>
    </BrowserRouter>
);
