const {Schema , model} = require("mongoose")
const { modelName } = require("./Registerschema")


const menejer = new Schema({
    login:String,
    password:String,
    avatar:{
        type:String,
        required:true,
        default:"https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
    }
})

module.exports = model("menejers" , menejer)
