import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import Visitor from './visitor';
import { apiKeys } from './apiKeys';


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
              return {key: repo.name, value: visitorDetail};
            })
            .catch(error => {
              alert("error!", error);
              return "errorr!";
            });
        });

        Promise.all(visitorPromises).then(visitorMap => {
          this.setState({repos, visitorMap});
        });
      })
      .catch(error => {
        alert("Error while getting repos...", error);
      });
  }

  getRepos = (user) => {
    const repoURL = `https://api.github.com/users/${user}/repos?sort=updated&direction=desc&per_page=5`;
    return axios.get(repoURL);
  }

  getVisitorDetail = (repo) => {
    // const repoURL = `https://api.github.com/users/dance2die/repos?sort=updated&direction=desc&per_page=3000`;
    const repoURL = `https://api.github.com/repos/dance2die/${repo}/traffic/views`;
    return axios.get(repoURL, {
      auth: {
        username: "dance2die",
        password: apiKeys.GITHUB_DEVELOPER_KEY
      }
    });
  }

  render() {
    const { repos, visitorMap } = this.state;
    // l("App", this.state);

    if (!repos || repos.length === 0) {
      return <div>Loading...</div>;
    }

    l("app.render.visitorMap", visitorMap);
    const visitors = visitorMap.map(visitor => {
      l("visitor inside app.map", visitor);
      return <Visitor key={visitor.key} repo={visitor.key} visitorDetail={visitor.value} />;
    });

    l('visitors!!!', visitors);

    return (
      <div>
        {visitors}
      </div>
    );
  }
}

export default App;
