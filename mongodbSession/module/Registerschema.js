const {Schema , model} = require("mongoose")


const UserRegisterSchema = new Schema({
    tel:{
        type:Object,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    fristName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    doc:{
        type:String,
        required:true
    },
    category:Object,
    acceptance:{
        type:Boolean,
        default:false
    },
    avatar:{
        type:String,
        default:"https://icon-library.com/images/avatar-icon-images/avatar-icon-images-4.jpg"
    },
    messageByTeacher:{
        type:Object,
        default:[
            {
                messageText:"Arizangiz muvofaqiyatli yuborildi, siz bilan boglanishlarini kuting",
                status:"success",
                teacher:"IT center",
                statusMessage:"ok",
                urlMessage:process.env.URL+"urlmessage/default",
                vaqt:""
            }
        ]
    },
    addition:{
        type:Object,
        required:true,
        default:{}
    },
    acceptance:{
        type:Boolean,
        default:false
    },
})

module.exports = model("students" , UserRegisterSchema)



/*
messageByTeache;[
    {
        messageText:"lorem",
        status:"success||danger",
        teacher:"kimdir",
        statusMessage:"message",
        urlMessage:"http://",
        vatq:"data"
    }
]
addition ==> qoshimcha malumotlar

acceptance ==> royhatga ustoz tomonidan olinganligi yoki yoq
*/