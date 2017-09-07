const axios = require('axios');

getAuth = () => {
    const password = process.env.GITHUB_DEVELOPER_KEY;

    return {
        username: "dance2die",
        password: password
    };
}

getVisitorDetail = (repo) => {
    const { login } = repo.owner;
    const url = `https://api.github.com/repos/${login}/${repo.name}/traffic/views`;

    return axios.get(url, { auth: getAuth() });
}

module.exports = {
      getUserDetail: (login) => {
        const url = `https://api.github.com/users/${login}`;

        return axios.get(url, { auth: getAuth() });
    },

    getRepos: (user) => {
        const login = user.data.login;
        const url = `https://api.github.com/users/${login}/repos?sort=updated&direction=desc&per_page=10`;

        return axios.get(url, { auth: getAuth() });
    },

    getVisitorDetails: ({ data: repos }) => {
        let promises = repos.map(repo => {
            return getVisitorDetail(repo)
                .then(response => {
                    let visitorDetail = response.data;
                    return { key: repo.name, value: visitorDetail, repo: repo };
                })
                .catch(error => {
                    l("repo error", error);
                    return { key: repo.name, value: {} };
                });
        });

        return Promise.all(promises);
    }   
};
