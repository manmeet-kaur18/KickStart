import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import CreateContracts from './createcontract';
import ViewContract from './viewContract';
import Checkoutrequests from './checkoutrequests';
import AddRequestsCampaign from './addrequestscampaign';
const routing = (
    <Router>
      <div>
        <Route exact path="/" component={App} />
        <Route exact path="/campaigns/new" component={CreateContracts} />
        <Route exact path="/:address" component={ViewContract} />
        <Route exact path="/:address/requests" component={Checkoutrequests} />
        <Route exact path="/:address/requests/new" component={AddRequestsCampaign} />
      </div>
    </Router>
  )
  ReactDOM.render(
    routing,
    document.getElementById('root')
  );

// ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
