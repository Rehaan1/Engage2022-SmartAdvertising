const video = document.getElementById('video')

let startTime, endTime, isHappy

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('./models'), // Smaller version of Face Detector for better performance
  faceapi.nets.faceLandmark68Net.loadFromUri('./models'), // Detects different parts of face - eyes, nose, mouth, etc
  faceapi.nets.faceRecognitionNet.loadFromUri('./models'), // Detects Where the face is by boxing around it
  faceapi.nets.faceExpressionNet.loadFromUri('./models'), // Recognizes Smile, Frown, Happy, Sad, etc
  faceapi.nets.ageGenderNet.loadFromUri('./models')
]).then(startVideo) // Once all models loaded and resolved asynchronously then call startvideo

// Render Video on Browser
function startVideo () {
  navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => { video.srcObject = stream }, (err) => console.error(err))
}

// event listener that listens to the play event of the video
video.addEventListener('play', () => {
  const { canvas, displaySize } = createFaceCanvas() // Creates and sets the Display Size for the FaceCanvas

  document.getElementById('videoNotice').innerHTML = ""
  document.getElementById('videoWarning').innerHTML = ""

  faceapi.matchDimensions(canvas, displaySize)

  // @TODO - Create Smart AR ADs

  const adImages = []

  for (let i = 0; i < 3; i++) {
    const adImage = document.createElement('img')
    adImage.id = 'adImage'
    adImage.width = '100%'
    adImage.height = 'auto'
    const id = 'adDiv' + i
    document.getElementById(id.toString()).appendChild(adImage)
    adImages.push(adImage)
  }

  setStartTime()

  DetectFaces(adImages, displaySize, canvas)
})

// Creates and sets the Display Size for the FaceCanvas
function createFaceCanvas () {
  const canvas = faceapi.createCanvasFromMedia(video)
  canvas.id = 'faceCanvas'
  document.getElementById('videoDiv').appendChild(canvas)
  const displaySize = { width: video.offsetWidth, height: video.offsetHeight }
  return { canvas, displaySize }
}

// Detects faces
function DetectFaces (adImages, displaySize, canvas) {
  let canChange = true

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions() // detects faces, landmarks and expressions every 100 ms
      .withAgeAndGender()

    endTime = new Date()
    if (endTime - startTime > 2000) {
      canChange = true
      setStartTime()
    }

    if (canChange) {
      handleEmotion(detections, adImages)
      canChange = false
    }

    // drawDetections(detections, displaySize, canvas);
  }, 100)
}

// Draws the detections
function drawDetections (detections, displaySize, canvas) {
  const resizeDetections = faceapi.resizeResults(detections, displaySize)

  canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height) // clear canvas

  faceapi.draw.drawDetections(canvas, resizeDetections) // draw box around face in canvas element
  faceapi.draw.drawFaceLandmarks(canvas, resizeDetections) // draws landmarks
  faceapi.draw.drawFaceExpressions(canvas, resizeDetections)
}

// Detects emotion and changes picture accordingly
function handleEmotion (detections, adImages) {
  if (detections[0] != undefined) {
    document.getElementById('adWarning').innerHTML = ""
    
    console.log('AGE: ' + detections[0].age)
    console.log('GENDER: ' + detections[0].gender)
    console.log('Happy: ' + detections[0].expressions.happy)
    console.log(detections[0].expressions)
    
    // Send Data to Server for Storing for Data Analysis
    const _data = {
      age: detections[0].age,
      gender: detections[0].gender
    }

    fetch('https://rehaanengage2022.herokuapp.com/data', {
      method: 'POST',
      body: JSON.stringify(_data),
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(err => console.log('RequestFailed', err))

    // Handle Emotion Changes for Advertisement

    if (detections[0].expressions.happy >= 0.001) {
      changeImage('./images/happy-final.webp', adImages, 0, 700, 250)
      changeImage('./images/boyhappy.png', adImages, 2, 300, 300)
      isHappy = true
    } else {
      changeImage('./images/neutral-final.webp', adImages, 0, 700, 250)
      isHappy = false
    }

    if (detections[0].gender === 'male') {
      if (!isHappy) { changeImage('./images/boy.png', adImages, 2, 300, 300) }
    } else {
      if (!isHappy) { changeImage('./images/girl.png', adImages, 2, 300, 300) }
    }

    if (detections[0].age > 27 && detections[0].age <= 40) {
      changeImage('./images/30.png', adImages, 1, 300, 300)
    } else if (detections[0].age > 20 && detections[0].age <= 27) {
      changeImage('./images/20.png', adImages, 1, 300, 300)
    } else {
      changeImage('./images/40.png', adImages, 1, 300, 300)
    }
  }
}

// Changes Image
function changeImage (imageLocation, adImages, bannerNo, height, width) {
  adImages[bannerNo].src = imageLocation
  adImages[bannerNo].height = height
  adImages[bannerNo].width = width
}

// Sets the start time for the timer
function setStartTime () {
  startTime = new Date()
}
