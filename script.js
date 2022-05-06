const video = document.getElementById('video')

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'), // Smaller version of Face Detector for better performance
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'), // Detects different parts of face - eyes, nose, mouth, etc
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'), // Detects Where the face is by boxing around it
    faceapi.nets.faceExpressionNet.loadFromUri('/models') //Recognizes Smile, Frown, Happy, Sad, etc
]).then(startVideo) //Once all models loaded and resolved asynchronously then call startvideo


// Render Video on Browser
function startVideo(){

    navigator.mediaDevices.getUserMedia({video: {}}) .then((stream)=> {video.srcObject = stream;}, (err)=> console.error(err));
}

video.addEventListener('play', ()=>{

    const canvas = faceapi.createCanvasFromMedia(video)
    document.body.append(canvas)
    const displaySize = { width: video.width, height: video.height}
    faceapi.matchDimensions(canvas,displaySize)

    setInterval(async ()=> {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions() //detects faces, landmarks and expressions every 100 ms

        console.log(detections)
        
        const resizeDetections = faceapi.resizeResults(detections, displaySize)

        canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height) //clear canvas
        
        faceapi.draw.drawDetections(canvas,resizeDetections) //draw box around face in canvas element
        faceapi.draw.drawFaceLandmarks(canvas,resizeDetections) //draws landmarks
        faceapi.draw.drawFaceExpressions(canvas, resizeDetections) //draw Expressions
        

    }, 100)
})