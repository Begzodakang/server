const studentSchema = require("../module/Registerschema")



const studentLogin = async (req, res)=>{
    const studentByDb = await studentSchema.findOne({
        name:req.body.name,
        fristName:req.body.fname
    }).lean()
    
    if(studentByDb && studentByDb.password == req.body.password){
        req.session.student = studentByDb
        req.session.islogged = true
        req.session.save((e)=>{if(e) throw e})
        res.send({status:true})
    }else{res.send({status:false})}
}


module.exports = {
    studentLogin
}