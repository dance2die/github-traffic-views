const express = require('express');
const cors = require('cors');
const app = express();

const path = require('path');
const githubUtil = require('./github-util');

const l = console.log;

// Enable CORS
app.use(cors());

// Serve static assets
// https://medium.com/@patriciolpezjuri/using-create-react-app-with-react-router-express-js-8fa658bf892d
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('/visitorMap/:user', (req, res) => {
    let user = req.params.user || "dance2die";
    const { getUserDetail, getRepos, getVisitorDetails } = githubUtil;

    getUserDetail("dance2die")
        .then(getRepos)
        .then(getVisitorDetails)
        // Send "res" (response object) to the promise pipeline: https://stackoverflow.com/a/32912570/4035
        .then(sendDataAndCloseConnection.bind(null, res))
        .catch(handleError);
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



sendDataAndCloseConnection = (res, data) => {
    // https://stackoverflow.com/questions/13554319/express-js-close-response
    res.set("Connection", "close");
    res.send(data);
}

handleError = (error) => {
    l("error!", error);
}
