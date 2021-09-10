import React from "react";
import axios from "axios";
import styled from "styled-components";
import styles from "./App.module.css";
import { sortBy } from "lodash";
import { Switch, Route } from "react-router-dom";
import Details from "./pages/details";

const App = () => {
    return ( <
        div className = "app" >
        <
        Switch > { /* <Route exact path="/" component={Home} /> */ } <
        Route exact path = "/details"
        component = { Details }
        /> <
        /Switch> <
        /div>
    );
};

export default App;