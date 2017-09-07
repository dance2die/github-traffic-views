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

// const staticPath = path.join(__dirname, '../build');
// // app.use(express.static('/public'));
// // app.use(express.static('build/'));
// app.use('/app', express.static(staticPath));

// Serve static assets
// https://medium.com/@patriciolpezjuri/using-create-react-app-with-react-router-express-js-8fa658bf892d
app.use(express.static(path.resolve(__dirname, '..', 'build')));

getAuth = () => {
    // l("apiKeys.GITHUB_DEVELOPER_KEY", apiKeys);
    const password = process.env.GITHUB_DEVELOPER_KEY;
    // l("password:", password);

    return {
        username: "dance2die",
        password: password
    };
}

getVisitorDetail = (repo) => {
    // l("-- getVisitorDetail --");

    const { login } = repo.owner;
    const url = `https://api.github.com/repos/${login}/${repo.name}/traffic/views`;
    return axios.get(url, { auth: getAuth() });
}

getUserDetail = (login) => {
    // l("-- getUserDetail --");

    const url = `https://api.github.com/users/${login}`;
    return axios.get(url, { auth: getAuth() });
}

getRepos = (user) => {
    const login = user.data.login;
    const url = `https://api.github.com/users/${login}/repos?sort=updated&direction=desc&per_page=10`;

    return axios.get(url, { auth: getAuth() });
}

getVisitorDetails = ({ data: repos }) => {
    let promises = repos.map(repo => {
        return getVisitorDetail(repo)
            .then(response => {
                let visitorDetail = response.data;
                // l("visitorDetail!!!", visitorDetail);
                return { key: repo.name, value: visitorDetail, repo: repo };
            })
            .catch(error => {
                l("repo error", error);
                // alert("error!", error);
                return { key: repo.name, value: {} };
            });
    });

    return Promise.all(promises);
}


// app.get('/getRepos/:user', (req, res) => {
//     let user = req.params.user || "dance2die";
//     getRepos(user)
//         .then(response => {
//             let repos = response.data;
//             l("repos returned:", repos);
//             // https://stackoverflow.com/questions/13554319/express-js-close-response
//             res.set("Connection", "close");
//             res.json(repos);
//         })
//         .catch(error => {
//             l("error!", error);
//         });
// });

// app.get('/getVisitorDetail/:user/:repo', (req, res) => {
//     let user = req.params.user || "dance2die";
//     let repo = req.params.repo || "MyAnimeListSharp";

//     getVisitorDetail(user, repo)
//         .then(response => {
//             let details = response.data;
//             l("details returnd:", details);
//             // https://stackoverflow.com/questions/13554319/express-js-close-response
//             res.set("Connection", "close");
//             res.json(details);
//         })
//         .catch(error => {
//             l("error!", error);
//         });
// });

app.get('/visitorMap/:user', (req, res) => {
    let user = req.params.user || "dance2die";
    l("user:", user);

    getUserDetail("dance2die")
    .then(getRepos)
    .then(getVisitorDetails)
    .then(visitorMap => {
        // https://stackoverflow.com/questions/13554319/express-js-close-response
        res.set("Connection", "close");
        res.send(visitorMap);
    })
    .catch(error => {
        l("error!", error);
    });
    
    // getRepos(user)
    //     .then(response => {
    //         let repos = response.data;
    //         let visitorPromises = repos.map(repo => {
    //             l("repo", repo);
    //             return getVisitorDetail(user, repo.name)
    //                 .then(response => {
    //                     let visitorDetail = response.data;
    //                     return { key: repo.name, value: visitorDetail, repo: repo };
    //                 })
    //                 .catch(error => {
    //                     l("repo error", error);
    //                     // alert("error!", error);
    //                     return { key: repo.name, value: {} };
    //                 });
    //         });

    //         Promise.all(visitorPromises).then(visitorMap => {
    //             // https://stackoverflow.com/questions/13554319/express-js-close-response
    //             res.set("Connection", "close");
    //             res.json(visitorMap);
    //         });
    //     })
    //     .catch(error => {
    //         l("Error while getting repos...", error);
    //     });
});

app.get('/', function (req, res) {
    res.send('Hello World! ' + staticPath);
});

// Always return the main index.html, so react-router render the route in the client
// https://medium.com/@patriciolpezjuri/using-create-react-app-with-react-router-express-js-8fa658bf892d
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});


const port = process.env.PORT || 80;
app.listen(port, function () {
    l(`Listening on port : ${port}`);
});
