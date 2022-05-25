const router = require('express').Router()


router.post('/',(req,res)=>{
    
    console.log(req.body)

    res.json({
        "message":"data received",
        "status":"200"
    })
})


module.exports = router