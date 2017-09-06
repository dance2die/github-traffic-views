import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Visitor from './visitor';
// import { apiKeys } from './apiKeys';
import shortid from 'short-id';

const apiKeys = require('./apiKeys').apiKeys || null;

// debug
const l = console.log;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      repos: [],
      visitorMap: {},
    }
  }

  componentDidMount() {
    this.getRepos("dance2die")
      .then(response => {
        let repos = response.data;
        let visitorPromises = repos.map(repo => {
          return this.getVisitorDetail(repo.name)
            .then(response => {
              let visitorDetail = response.data;
              return { key: repo.name, value: visitorDetail };
            })
            .catch(error => {
              alert("error!", error);
              return "errorr!";
            });
        });

        Promise.all(visitorPromises).then(visitorMap => {
          this.setState({ repos, visitorMap });
        });
      })
      .catch(error => {
        alert("Error while getting repos...", error);
      });
  }

  getRepos = (user) => {
    const repoURL = `https://api.github.com/users/${user}/repos?sort=updated&direction=desc&per_page=100`;
    return axios.get(repoURL);
  }

  getVisitorDetail = (repo) => {
    const repoURL = `https://api.github.com/repos/dance2die/${repo}/traffic/views`;
    return axios.get(repoURL, {
      auth: {
        username: "dance2die",
        password: apiKeys.GITHUB_DEVELOPER_KEY || process.env.GITHUB_DEVELOPER_KEY
      }
    });
  }

  render() {
    let { repos, visitorMap } = this.state;
    // l("App", this.state);

    if (!repos || repos.length === 0) {
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
