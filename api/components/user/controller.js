const nanoid = require('nanoid');
const auth = require('../auth');

const TABLE = 'user';

module.exports = function(injectedStore) {
    let store = injectedStore;
    if (!store ) {
        store = require('../../../store/mysql');
    }

    function list() {
        return store.list(TABLE);
    }
    
    function get(id) {
        return store.get(TABLE, id);
    }

    async function upsert(body) {
        const user = {
            name: body.name,
            userName: body.userName
        }

        if (body.id) {
            user.id = body.id;
        } else {
            user.id = nanoid();
        }

        if (body.password || body.userName) {
            await auth.upsert({
                id: user.id,
                userName: user.userName,
                password: body.password
            })
        } 

        return store.upsert(TABLE, user);
    }

    function follow(from, to) {
        return store.upsert(TABLE + '_follow' , {
            user_from: from,
            user_to: to
        });
    }

    return {
        list,
        get,
        upsert,
        follow
    }
}