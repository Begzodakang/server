const mongoose = require("mongoose")
const connection = async ()=>{
    const connect = await mongoose.connect(process.env.MONGODB_CONNECT_HREF)
    console.log("DB connect to" ,connect.connection.host);
}
module.exports = connection