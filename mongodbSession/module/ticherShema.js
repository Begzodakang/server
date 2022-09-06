// {
//     "_id": {
//       "$oid": "6301de64f4246da6cb544689"
//     },
//     "name": "Asadbek",
//     "firstName": "",
//     "specialty": [
//       {
//         "name": "grafik-dizayn"
//       }
//     ],
//     "sertifikat": [],
//     "autoBiografiya": "",
//     "avatar": ""
//   }

const {Schema , model} = require("mongoose")

const ticherShema = new Schema({
    name:String,
    fristName:String,
    specialty:Object,
    sertifikat:Object,
    autoBiografiya:String,
    avatar:String,
    password:String
})


module.exports = model("tichers" , ticherShema)