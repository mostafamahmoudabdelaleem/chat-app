const Users = [];

function joinUser(id, name, room){
    user = {
        id,
        name,
        room
    }
    Users.push(user);
    return user;
}

function getCurrentUser(id){
    return Users.find(user => user.id === id);
}

function userLeft(id){
    const i = Users.findIndex(user => user.id === id);

    if(i !== -1){
        return Users.splice(i, 1)[0];
    }
}

function getRoomUsers(room){
    return Users.filter(user => user.room === room);
}

module.exports = {
    joinUser,
    getCurrentUser,
    userLeft,
    getRoomUsers
};
