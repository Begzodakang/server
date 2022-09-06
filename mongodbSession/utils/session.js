const express_session = require("express-session")
const mongoStore = require("connect-mongodb-session")(express_session)

const store =new mongoStore({
    collection:"session",
    uri:process.env.MONGODB_CONNECT_HREF
})

const session = express_session({
    secret:"secret",
    saveUninitialized:false,
    resave:false,
    store
})

module.exports = session