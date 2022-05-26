const router = require('express').Router()
const AudienceModel = require('../../models/audienceModel')


router.get('/analytics',(req,res) => {
    console.log("Analytics Called")
    return res.status(200).json({
        message:"success"
    })
})

router.post('/',(req,res)=>{
    
    console.log(req.body)

    if(!req.body.age)
    {
        return res.status(4000).json({
            status: 400,
            erroMessage: 'Missing required parameters. Refer documentation'
        })
    }

    if(!req.body.gender)
    {
        return res.status(4000).json({
            status: 400,
            erroMessage: 'Missing required parameters. Refer documentation'
        })
    }

    new AudienceModel({
        age: req.body.age,
        gender: req.body.gender
    })
    .save()
    .then((newAudienceMode) => {
        return res.status(200).json({
            status: 200,
            message: "Data Entered succesfully"
        })
    })
    .catch((error)=>{
        return res.status(400).json({
            status: 400,
            success: false,
            error: error
        })
    })

    
})


module.exports = router