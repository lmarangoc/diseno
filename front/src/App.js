import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { Live } from "./Live";
import { History } from "./History";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Live} />
        <Route exact path="/history" component={History} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
