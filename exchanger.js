const db = require('sqlite');
const DB_NAME = './database.sqlite';

const exchanger = {};

const filterOutKey = (data, keyToFilter) => {
    return data.map((user) => Object.assign(
        {},
        ...Object.keys(user).filter(userKey => userKey !== keyToFilter)
                            .map(key => ({[key]: user[key]}))
    ));
}

// get only users list
exchanger.getUsers = () => {
    return db.all(`SELECT * FROM users`).then((data) => filterOutKey(data, 'PASSWORD'));
};

// Get all users + their activity
exchanger.getUsersActivity = () => {
    return db.all(`SELECT * FROM users
                    INNER JOIN activities ON activities.user_id = users.id`)
};

// Get a specified user via user.id + their activity
exchanger.getUser = (user_id) => {
    return db.all(`SELECT * FROM users
            INNER JOIN activities ON activities.user_id = users.id
            WHERE users.id = ${user_id}`)
};

// Get users that $user_id follows
exchanger.getFollowed = (user_id) => {
    return db.all(`SELECT
                users.name AS name,
                users.email AS email,
                activities.activity_type_id AS activity_type_id,
                activities.activity_payload AS payload
            FROM users
                INNER JOIN followers ON followers.follower_id = users.id
                INNER JOIN activities ON activities.user_id = users.id
            WHERE followers.user_id = ${user_id}`)
};

// Create a post
exchanger.createPost = (user_id, request) => {
    return db.run(`INSERT INTO activities (user_id, activity_type_id, activity_payload) values (${user_id}, $activity_type_id, $activity_payload)`, request)
};

// Follow a user
exchanger.followUser = (user_id, followed_id) => {
    return db.run(`INSERT INTO followers (user_id, follower_id) VALUES (${user_id}, ${follower_id})`)
};

// Edit a post
exchanger.updatePost = (post_id, updatedPost) => {
    return db.run(`UPDATE activities SET activity_payload = ${updatedPost} WHERE ID = ${post_id}`)
};

// Delete a post
exchanger.deletePost = (post_id) => {
    return db.run(`DELETE FROM activities WHERE ID = ${post_id}`)
};

// Unfollow a user
exchanger.unfollow = (user_id, followed_id) => {
    return db.run(`DELETE FROM followers WHERE user_id = ${user_id} AND followed_id = ${follower_id}`)
};

module.exports = exchanger;
