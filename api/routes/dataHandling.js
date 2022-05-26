const router = require('express').Router()
const AudienceModel = require('../../models/audienceModel')

router.get('/analytics/getData', (req, res) => {
  console.log('Analytics Called')

  let audienceInfoObj
  let avgAge = 0
  let malePercent = 0
  let femalePercent = 0
  AudienceModel.find()
    .sort({ date: -1 })
    .limit(50)
    .then((audienceInfos) => {
      audienceInfoObj = audienceInfos
      audienceInfoObj.forEach((audienceInfo) => {
        avgAge += audienceInfo.age
        if (audienceInfo.gender === 'male') {
          malePercent += 1
        } else {
          femalePercent += 1
        }
      })

      avgAge = (avgAge / 50).toFixed(2)
      malePercent = (100 * (malePercent / 50)).toFixed(2)
      femalePercent = (100 * (femalePercent / 50)).toFixed(1)

      return res.status(200).json({
        status: 200,
        success: true,
        avgAge: avgAge,
        malePercent: malePercent,
        femalePercent: femalePercent
      })
    })
    .catch((err) => {
      return res.status(400).json({
        status: 400,
        success: false,
        error: err
      })
    })
})

router.post('/', (req, res) => {
  console.log(req.body)

  if (!req.body.age) {
    return res.status(4000).json({
      status: 400,
      erroMessage: 'Missing required parameters. Refer documentation'
    })
  }

  if (!req.body.gender) {
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
        message: 'Data Entered succesfully'
      })
    })
    .catch((error) => {
      return res.status(400).json({
        status: 400,
        success: false,
        error: error
      })
    })
})

module.exports = router
