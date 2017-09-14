import React from 'react';
import PropTypes from 'prop-types';

import './UserCard.css';

const UserCard = ({ userDetail }) => {
    const { avatar_url, bio, blog, name, login, html_url, followers, followers_url, following, following_url } = userDetail;

    return (
        <div className="UserCard">
            <header>
                <Title name={name} login={login} url={html_url} />
            </header>
            <main>
                <section>
                    <img src={avatar_url} />
                </section>
                <section>
                    <div>Bio: {bio}</div>
                    <div>Blog: <a href={blog}>{blog}</a></div>
                    <div className="UserCard-follow">
                        <span>Followers: <a href={followers_url}>{followers}</a></span>
                        <span>Following: <a href={following_url}>{following}</a></span>
                    </div>
                </section>
            </main>
        </div>
    );
};
UserCard.propTypes = {
    userDetail: PropTypes.object.isRequired
};

const Title = ({name, login, url}) => {
    return (
        <div className="UserCard-title">
            <span>Visitor Grahp for {name} (<a href={url}>{login}</a>)</span>
        </div>
    );
};
Title.propTypes = {
    name: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
    url: PropTypes.string
};


export default UserCard;


