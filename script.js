const video = document.getElementById('video')

var startTime, endTime

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'), // Smaller version of Face Detector for better performance
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'), // Detects different parts of face - eyes, nose, mouth, etc
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'), // Detects Where the face is by boxing around it
    faceapi.nets.faceExpressionNet.loadFromUri('/models'), //Recognizes Smile, Frown, Happy, Sad, etc
    faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startVideo) //Once all models loaded and resolved asynchronously then call startvideo


// Render Video on Browser
function startVideo()
{
    navigator.mediaDevices.getUserMedia({video: {}}) .then((stream)=> {video.srcObject = stream;}, (err)=> console.error(err));
}

// event listener that listens to the play event of the video 
video.addEventListener('play', ()=>{

    const adCanvas = createAdCanvas(); //  Creates the AdCanvas where Smart AR Advertisements will be displayed
    var adCanvasCtx = adCanvas.getContext("2d")

    const { canvas, displaySize } = createFaceCanvas(); // Creates and sets the Display Size for the FaceCanvas
    
    faceapi.matchDimensions(canvas,displaySize)

    // @TODO - Create Smart AR ADs
    // var adImage = document.getElementById("ad")
    
    var adImage = document.createElement('img')
    adImage.id = "adImage"
    adCanvas.appendChild(adImage)

    setStartTime()

    DetectFaces(adImage, displaySize, canvas, adCanvasCtx);
})

// Creates and sets the Display Size for the FaceCanvas
function createFaceCanvas() {
    const canvas = faceapi.createCanvasFromMedia(video);
    canvas.id = "faceCanvas";
    document.getElementById("videoDiv").appendChild(canvas);
    const displaySize = { width: video.offsetWidth, height: video.offsetHeight };
    return { canvas, displaySize };
}

//  Creates the AdCanvas where Smart AR Advertisements will be displayed
function createAdCanvas() {
    adCanvas = document.createElement("CANVAS");
    adCanvas.id = "adCanvas";
    document.getElementById("adDiv1").appendChild(adCanvas);
    return adCanvas
}

// Detects faces
function DetectFaces(adImage, displaySize, canvas, adCanvasCtx) 
{

    var canChange = true

    setInterval(async () => {

        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions() //detects faces, landmarks and expressions every 100 ms
            .withAgeAndGender();

        endTime = new Date();
        if (endTime - startTime > 1000) 
        {
            canChange = true;
            setStartTime();
        }

        if (canChange) 
        {
            handleEmotion(detections, adImage, adCanvasCtx);
            canChange = false;
        }

        drawDetections(detections, displaySize, canvas); 

    }, 100);
}

// Draws the detections 
function drawDetections(detections, displaySize, canvas) {
    const resizeDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height); //clear canvas

    faceapi.draw.drawDetections(canvas, resizeDetections); //draw box around face in canvas element
    faceapi.draw.drawFaceLandmarks(canvas, resizeDetections); //draws landmarks
    faceapi.draw.drawFaceExpressions(canvas, resizeDetections);
}

// Detects emotion and changes picture accordingly
function handleEmotion(detections, adImage, adCanvasCtx)
{
    
    if(detections[0]!=undefined)
    {
        console.log("AGE: "+detections[0].age)
        console.log("GENDER: "+detections[0].gender)
        console.log("Happy: "+detections[0].expressions.happy)

        if(detections[0].expressions.happy >= 0.04)
        {
            changeImage("/images/test2.jfif", adCanvasCtx, adImage)
        }
        else
        {
            changeImage("/images/test1.jfif", adCanvasCtx, adImage)
        }
    }
}

// Changes Image
function changeImage(imageLocation, adCanvasCtx, adImage)
{
    adImage.src = imageLocation
    adImage.height = 100
    adImage.width = 200
    adCanvasCtx.drawImage(adImage, 0, 0)
}

// Sets the start time for the timer
function setStartTime()
{
    startTime = new Date()
}