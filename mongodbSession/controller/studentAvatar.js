const studentSchema = require("../module/Registerschema")

const avatarUpload = async (req,res)=>{
    const studentID = req.session.student._id
    await studentSchema.findByIdAndUpdate(studentID, {avatar:process.env.URL+"uploads/images/"+req.file.filename})
    const student = await studentSchema.findById(studentID).lean()
    res.send(JSON.stringify(student))
}

module.exports = avatarUpload