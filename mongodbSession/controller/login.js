const ticherShema = require("../module/ticherShema")



const loginTicher = async (req, res)=>{
    const ticher = await ticherShema.findOne(
        {
            name:req.body.name,
            firstName:req.body.fname
        }).lean()
        
        if(ticher && ticher.password == req.body.password){
            req.session.ticher = ticher
            req.session.isloggedTicher = true
            req.session.save((e)=>{if(e) throw e})
            res.send({
                status:true
            })
        }else{
            res.send({
                status:false
            })
        }
}
module.exports = {
    loginTicher
}