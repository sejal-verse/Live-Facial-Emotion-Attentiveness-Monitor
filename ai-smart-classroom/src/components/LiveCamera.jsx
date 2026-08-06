import { useRef, useState, useEffect } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import * as faceapi from "face-api.js";

function LiveCamera() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionInterval = useRef(null);

  const [stream, setStream] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [status, setStatus] = useState("Loading AI Models...");
  const [emotion, setEmotion] = useState("Unknown");

  // ---------------- LOAD MODELS ----------------

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";

        console.log("Loading Tiny Face Detector...");
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);

        console.log("Loading Face Landmark...");
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

        console.log("Loading Face Expression...");
        await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

        console.log("✅ All FaceAPI Models Loaded");

        setModelsLoaded(true);
        setStatus("AI Models Loaded");
      } catch (err) {
        console.error(err);
        setStatus("Model Loading Failed");
      }
    };

    loadModels();

    return () => {
      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, []);

  // ---------------- START CAMERA ----------------

  const startCamera = async () => {
    if (!modelsLoaded) {
      alert("Please wait. AI Models are still loading.");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
        },
      });

      videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);

      videoRef.current.onloadedmetadata = async () => {
        await videoRef.current.play();
        detectFaces();
      };

      setStatus("Camera Started");
    } catch (err) {
      console.error(err);
      alert("Unable to access camera.");
    }
  };

  // ---------------- STOP CAMERA ----------------

  const stopCamera = () => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }

    setEmotion("Unknown");
    setStatus("Camera Stopped");
    setStream(null);
  };
    // ---------------- FACE DETECTION ----------------

  const detectFaces = () => {
  detectionInterval.current = setInterval(async () => {

    if (
      !videoRef.current ||
      videoRef.current.readyState !== 4
    ) {
      return;
    }

    const detections = await faceapi
      .detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 512,
          scoreThreshold: 0.2,
        })
      )
      .withFaceLandmarks()
      .withFaceExpressions();

    console.log("Detections:", detections);
    console.log("Number of faces:", detections.length);
    const canvas = canvasRef.current;

    const displaySize = {
      width: videoRef.current.videoWidth,
      height: videoRef.current.videoHeight,
    };

    faceapi.matchDimensions(canvas, displaySize);

    const resized = faceapi.resizeResults(
      detections,
      displaySize
    );

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faceapi.draw.drawDetections(canvas, resized);
    faceapi.draw.drawFaceLandmarks(canvas, resized);
    faceapi.draw.drawFaceExpressions(canvas, resized);

    if (detections.length > 0) {

      const expressions = detections[0].expressions;
      console.log("Expressions:", expressions);
      const dominantEmotion = Object.keys(expressions).reduce(
        (a, b) =>
          expressions[a] > expressions[b] ? a : b
      );

      setEmotion(dominantEmotion);
      setStatus("✅ Face Detected");

    } else {

      setEmotion("No Emotion");
      setStatus("❌ No Face Detected");

    }

    }, 150);
  };
    return (
    <div className="bg-white rounded-2xl shadow-xl p-6">

      <h2 className="text-2xl font-bold mb-2">
        🎥 Live Face Detection
      </h2>

      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="bg-green-50 rounded-xl p-4 shadow">
          <h3 className="font-semibold text-gray-700">
            AI Status
          </h3>

          <p className="text-green-600 font-bold mt-2">
            {status}
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 shadow">
          <h3 className="font-semibold text-gray-700">
            Current Emotion
          </h3>

          <p className="text-blue-600 font-bold mt-2 capitalize">
            {emotion}
          </p>
        </div>

        <div className="bg-yellow-50 rounded-xl p-4 shadow">
          <h3 className="font-semibold text-gray-700">
            AI Model
          </h3>

          <p className="text-yellow-600 font-bold mt-2">
            TinyFaceDetector
          </p>
        </div>

      </div>

      <div className="relative">

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-[500px] bg-black rounded-xl object-cover"
        />

        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-[500px]"
        />

      </div>

      <div className="flex gap-4 mt-6">

        <button
          onClick={startCamera}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <FaPlay />
          Start Camera
        </button>

        <button
          onClick={stopCamera}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl flex items-center justify-center gap-2"
        >
          <FaStop />
          Stop Camera
        </button>

      </div>

    </div>
  );
}

export default LiveCamera;