import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Visitor from './visitor';
import shortid from 'short-id';

// debug
const l = console.log;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: props.user,
      visitorMap: []
    }
  }

  componentDidMount() {
    const apiURL = `${window.location.protocol}//${window.location.hostname}/visitorMap/${this.state.user}`;
    l("apiURL", apiURL);
    axios.get(apiURL)
      .then(response => {
        l("res", response);
        const visitorMap = response.data;
        this.setState({ visitorMap });
      })
      .catch(error => {
        l("error in app.js", error);
      });
  }

  render() {
    let { visitorMap } = this.state;
    l("render, visitorMap", visitorMap);

    // if (!repos || repos.length === 0) {
    if (!visitorMap || visitorMap.length === 0) {
      return <div>Loading...</div>;
    }

    visitorMap = visitorMap
      // Do not display graph with no traffic history
      .filter(visitor => visitor.value.views.length > 0)
      // Show graph with most traffic history count
      .sort((a, b) => b.value.views.length - a.value.views.length);

    l('vmap', visitorMap);

    const visitors = visitorMap
      .map(visitor => {
        const repo = visitor.key;
        const visitorDetail = visitor.value;
        const id = shortid.generate();

        return <Visitor key={id} id={id} repo={repo} visitorDetail={visitorDetail} />;
      });

    return (
      <div>
        {visitors}
      </div>
    );
  }
}

export default App;
