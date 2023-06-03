import React, { useState, useRef } from 'react';

export function Audio() {
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const audioRef = useRef(null);

    const handleRecord = () => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;
                chunksRef.current = [];

                mediaRecorder.addEventListener('dataavailable', (event) => {
                    chunksRef.current.push(event.data);
                });

                mediaRecorder.addEventListener('stop', () => {
                    const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                    setAudioBlob(audioBlob);
                });

                mediaRecorder.start();

                setIsRecording(true);
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
            });
    };

    const handlePause = () => {
        if (mediaRecorderRef.current && !isPaused) {
            mediaRecorderRef.current.pause();
            setIsPaused(true);
        }
    };

    const handleResume = () => {
        if (mediaRecorderRef.current && isPaused) {
            mediaRecorderRef.current.resume();
            setIsPaused(false);
        }
    };

    const handleStop = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsPaused(false);
        }
    };

    const handlePlay = () => {
        if (audioBlob) {
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;
            audioRef.current.play();
        }
    };

    return (
        <section className="page">
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                onClick={handleRecord}
                className={`icon ${isRecording ? 'active' : ''}`}
            >
                <circle className="circle" cx="12" cy="12" r="10" />
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                onClick={handlePause}
                className={`icon ${!isRecording || isPaused ? 'disabled' : ''}`}
            >
                <rect className="rect" x="9" y="6" width="2" height="12" />
                <rect className="rect" x="13" y="6" width="2" height="12" />
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                onClick={handleResume}
                className={`icon ${!isRecording || !isPaused ? 'disabled' : ''}`}
            >
                <path className="path" d="M14 5v14l-6-7z" />
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                onClick={handleStop}
                className={`icon ${!isRecording ? 'disabled' : ''}`}
            >
                <rect className="rect" x="6" y="6" width="12" height="12" />
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                onClick={handlePlay}
                className={`icon ${!audioBlob ? 'disabled' : ''}`}
            >
                <path className="path" d="M8 5v14l11-7z" />
            </svg>
            <audio ref={audioRef} controls />
        </div>
    </section>
    );
}
