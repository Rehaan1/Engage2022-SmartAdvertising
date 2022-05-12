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

    const { canvas, displaySize } = createFaceCanvas(); // Creates and sets the Display Size for the FaceCanvas
    
    faceapi.matchDimensions(canvas,displaySize)

    // @TODO - Create Smart AR ADs
    // var adImage = document.getElementById("ad")
    
    var adImage // dummy holder

    setStartTime()

    DetectFaces(adImage, displaySize, canvas);
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
    document.getElementById("videoDiv").appendChild(adCanvas);
    return adCanvas
}

// Detects faces
function DetectFaces(adImage, displaySize, canvas) 
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
            //handleEmotion(detections, adImage);
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
function handleEmotion(detections, adImage)
{
    
    if(detections[0]!=undefined)
    {
        console.log("AGE: "+detections[0].age)
        console.log("GENDER: "+detections[0].gender)
        console.log("Happy: "+detections[0].expressions.happy)

        if(detections[0].expressions.happy >= 0.04)
        {
            changeImage("/images/test2.jfif", adImage)
        }
        else
        {
            changeImage("/images/test1.jfif", adImage)
        }
    }
}

// Changes Image
function changeImage(imageLocation, adImage)
{
    adImage.src = imageLocation
}

// Sets the start time for the timer
function setStartTime()
{
    startTime = new Date()
}