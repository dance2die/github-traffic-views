const express = require('express');
const app = express();
// const apiKeys = require('./apiKeys');
const axios = require('axios');
const path = require('path');

const l = console.log;

// Enable CORS
// https://enable-cors.org/server_expressjs.html
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const staticPath = path.join(__dirname, '../../build');
// app.use(express.static('/public'));
// app.use(express.static('build/'));
app.use('/static', express.static(staticPath));

// app.get('/', function (req, res) {
//     res.send('Hello World! ' + staticPath);
// });


// app.get('/static', app.use(express.static('src')));


function getAuth() {
    // l("apiKeys.GITHUB_DEVELOPER_KEY", apiKeys);
    const password = process.env.GITHUB_DEVELOPER_KEY;
    // l("password:", password);

    return {
        username: "dance2die",
        password: password
    };
}

function getRepos(user) {
    const repoURL = `https://api.github.com/users/${user}/repos?sort=updated&direction=desc&per_page=100`;
    return axios.get(repoURL, { auth: getAuth() });
};

getVisitorDetail = (repo) => {
    const repoURL = `https://api.github.com/repos/dance2die/${repo}/traffic/views`;
    return axios.get(repoURL, { auth: getAuth() });
}

app.get('/visitorMap', (req, res) => {
    getRepos("dance2die")
        .then(response => {
            let repos = response.data;
            let visitorPromises = repos.map(repo => {
                return getVisitorDetail(repo.name)
                    .then(response => {
                        let visitorDetail = response.data;
                        return { key: repo.name, value: visitorDetail };
                    })
                    .catch(error => {
                        l("repo error", error);
                        // alert("error!", error);
                        return { key: repo.name, value: {} };
                    });
            });

            Promise.all(visitorPromises).then(visitorMap => {
                // https://stackoverflow.com/questions/13554319/express-js-close-response
                res.set("Connection", "close");
                res.json(visitorMap);
            });
        })
        .catch(error => {
            l("Error while getting repos...", error);
        });
});

// All remaining requests return the React app, so it can handle routing.
// https://github.com/mars/heroku-cra-node/blob/master/server/index.js
app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../../build', 'index.html'));
  });


const port = process.env.PORT || 3001;
app.listen(port, function () {
    l(`Listening on port : ${port}`);
});
