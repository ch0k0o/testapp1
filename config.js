module.exports = {
    organization: 'vmware',
    cacheTTL: 120, // seconds
    jwtTTL: 1000 * 60 *2, // miliseconds
    cookiesTTL: 1000 * 60 *2, // miliseconds
    secret: 'Wubba lubba dub dub',
    users: {
        1: {
            id: 1,
            username: 'guest',
            password: 'guest'
        },
        2: {
            id: 2,
            username: 'admin',
            password: 'admin',
            admin: true
        }
    }
};