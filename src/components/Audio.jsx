import React, { useState, useRef, useEffect } from 'react';
import './audio.css';

export function Audio() {
    useEffect(() => {
        function fetchData() {
            const username = localStorage.getItem('user');
            const r = indexedDB.open(username);

            r.onsuccess = function (e) {
                const db = e.target.result;
                const t = db.transaction(['notebookNames'], 'readonly');
                const objectStore = t.objectStore('notebookNames');
                const request = objectStore.get('audio-1-items');

                request.onsuccess = function (e) {
                    if (e.target.result) {
                        const record = e.target.result.recordings;
                        setRecordings(record);
                    }
                };
            };
        }

        fetchData();
        // Cleanup function
        return () => {
            // Perform any necessary cleanup here
        };
    }, []);
    const [recordings, setRecordings] = useState([]);
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [newRecordingName, setNewRecordingName] = useState('');
    const [selectedRecording, setSelectedRecording] = useState(null);
    const [editingIndex, setEditingIndex] = useState(null);
    const [isMicrophoneEnabled, setIsMicrophoneEnabled] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        requestMicrophonePermission();
    }, []);

    const requestMicrophonePermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsMicrophoneEnabled(true);
            stream.getTracks().forEach((track) => track.stop());
        } catch (error) {
            setIsMicrophoneEnabled(false);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsMicrophoneEnabled(true);
            stream.getTracks().forEach((track) => track.stop());
        } catch (error) {
            alert('Please enable microphone access.');
            setIsMicrophoneEnabled(false);
            return;
        }
        if (!isMicrophoneEnabled) {
            alert('Please enable microphone access.');
            return;
        }

        setIsRecording(true);
        setIsPaused(false);
        setNewRecordingName('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const chunks = [];

            mediaRecorder.addEventListener('dataavailable', (e) => {
                chunks.push(e.data);
            });

            mediaRecorder.addEventListener('stop', () => {
                const recordingBlob = new Blob(chunks, { type: 'audio/wav' });
                const reader = new FileReader();

                reader.onloadend = function () {
                    const recordingData = reader.result;
                    const recordingName =
                        newRecordingName ||
                        new Date().toLocaleString('default', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        });

                    setRecordings((prevRecordings) => [
                        { name: recordingName, data: recordingData },
                        ...prevRecordings,
                    ]);

                    const r = indexedDB.open(localStorage.getItem('user'));
                    r.onsuccess = function (e) {
                        let db = e.target.result;
                        let t = db.transaction(['notebookNames'], 'readwrite');
                        let objectStore = t.objectStore('notebookNames');
                        let request = objectStore.get('audio-1-items');
                        request.onsuccess = function (e) {
                            let record = e.target.result;
                            if (!record) {
                                let t = db.transaction(['notebookNames'], 'readwrite');
                                let objectStore = t.objectStore('notebookNames');
                                objectStore.add({
                                    name: 'audio-1-items',
                                    recordings: [{ name: recordingName, data: recordingData }],
                                });
                            } else {
                                record.recordings = [
                                    { name: recordingName, data: recordingData },
                                    ...record.recordings,
                                ];
                                const updateRequest = t
                                    .objectStore('notebookNames')
                                    .put(record);

                                updateRequest.onsuccess = function (event) {
                                };

                                updateRequest.onerror = function (event) {
                                    console.log('Error updating record: ' + event.target.error);
                                };
                            }
                        };
                    };
                };

                reader.readAsDataURL(recordingBlob);
            });

            setRecording(mediaRecorder);
            mediaRecorder.start();
        } catch (error) {
            console.error('Error starting recording:', error);
        }
    };

    const pauseRecording = () => {
        if (recording && !isPaused) {
            recording.pause();
            setIsPaused(true);
        }
    };

    const resumeRecording = () => {
        if (recording && isPaused) {
            recording.resume();
            setIsPaused(false);
        }
    };

    const stopRecording = () => {
        if (recording) {
            recording.stop();
            setRecording(null);
            setIsRecording(false);
            setIsPaused(false);
        }
    };

    const deleteRecording = (index) => {
        const updatedRecordings = [...recordings];
        updatedRecordings.splice(index, 1);
        setRecordings(updatedRecordings);
        const r = indexedDB.open(localStorage.getItem('user'));
        r.onsuccess = function (e) {
            let db = e.target.result;
            let t = db.transaction(['notebookNames'], 'readwrite');
            let objectStore = t.objectStore('notebookNames');
            let request = objectStore.get('audio-1-items');
            request.onsuccess = function (e) {
                let record = e.target.result;
                record.recordings = updatedRecordings;
                const updateRequest = t.objectStore('notebookNames').put(record);

                updateRequest.onsuccess = function (event) {
                };

                updateRequest.onerror = function (event) {
                    console.log('Error updating record: ' + event.target.error);
                };
            };
        };
    };

    const handleRecordingNameChange = (event, index) => {
        if (index === editingIndex) {
            const updatedRecordings = [...recordings];
            updatedRecordings[index].name = event.target.value;
            setRecordings(updatedRecordings);
        }
    };

    const selectRecording = (index) => {
        setSelectedRecording(index);
    };

    const startEditing = (index) => {
        setEditingIndex(index);
    };

    const handleNameConfirmation = (index) => {
        if (index === editingIndex) {
            setEditingIndex(null);
        }
        const r = indexedDB.open(localStorage.getItem('user'));
        r.onsuccess = function (e) {
            let db = e.target.result;
            let t = db.transaction(['notebookNames'], 'readwrite');
            let objectStore = t.objectStore('notebookNames');
            let request = objectStore.get('audio-1-items');
            request.onsuccess = function (e) {
                let record = e.target.result;
                record.recordings = recordings;
                const updateRequest = t.objectStore('notebookNames').put(record);

                updateRequest.onsuccess = function (event) {
                };

                updateRequest.onerror = function (event) {
                    console.log('Error updating record: ' + event.target.error);
                };
            };
        };
    };

    return (
        <section className="audio-parent-container page">
            <div className="audio-container">
                <div className="audio-controls">
                    {isMicrophoneEnabled ? (
                        isRecording ? (
                            <>
                                {isPaused ? (
                                    <>
                                        <button className="control-button resume" onClick={resumeRecording}>
                                            Resume
                                        </button>
                                        <button className="control-button stop" onClick={stopRecording}>
                                            Stop
                                        </button>
                                        <span className="recording-status">Recording is paused</span>
                                    </>
                                ) : (
                                    <>
                                        <button className="control-button pause" onClick={pauseRecording}>
                                            Pause
                                        </button>
                                        <button className="control-button stop" onClick={stopRecording}>
                                            Stop
                                        </button>
                                    </>
                                )}
                            </>
                        ) : (
                            <button className="control-button start" onClick={startRecording}>
                                Start Recording
                            </button>
                        )
                    ) : (
                        <div className="microphone-error">
                            <span className="error-message">Microphone access denied.</span>
                        </div>
                    )}
                    {isRecording && !isPaused && <span className="recording-status">Recording...</span>}
                </div>
                <ul className="audio-list">
                    {recordings.map((recording, index) => (
                        <li
                            key={index}
                            className={`audio-item ${selectedRecording === index ? 'selected' : ''}`}
                        >
                            <div className="audio-info">
                                {editingIndex === index ? (
                                    <input
                                        type="text"
                                        className="audio-input"
                                        value={recording.name}
                                        autoFocus
                                        onChange={(e) => handleRecordingNameChange(e, index)}
                                        onBlur={() => handleNameConfirmation(index)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleNameConfirmation(index);
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="audio-name" onClick={() => startEditing(index)}>
                                        {recording.name}
                                    </div>
                                )}
                                <div className="audio-actions">
                                    <button className="audio-delete" onClick={() => deleteRecording(index)}>
                                        <svg className="trash-icon" viewBox="0 0 20 18">
                                            <path
                                                d="M17.114,3.923h-4.589V2.427c0-0.252-0.207-0.459-0.46-0.459H7.935c-0.252,0-0.459,0.207-0.459,0.459v1.496h-4.59c-0.252,0-0.459,0.205-0.459,0.459c0,0.252,0.207,0.459,0.459,0.459h1.51v12.732c0,0.252,0.207,0.459,0.459,0.459h10.29c0.254,0,0.459-0.207,0.459-0.459V4.841h1.511c0.252,0,0.459-0.207,0.459-0.459C17.573,4.127,17.366,3.923,17.114,3.923M8.394,2.886h3.214v0.918H8.394V2.886z M14.686,17.114H5.314V4.841h9.372V17.114z M12.525,7.306v7.344c0,0.252-0.207,0.459-0.46,0.459s-0.458-0.207-0.458-0.459V7.306c0-0.254,0.205-0.459,0.458-0.459S12.525,7.051,12.525,7.306M8.394,7.306v7.344c0,0.252-0.207,0.459-0.459,0.459s-0.459-0.207-0.459-0.459V7.306c0-0.254,0.207-0.459,0.459-0.459S8.394,7.051,8.394,7.306"></path>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <audio
                                className="audio-player"
                                ref={audioRef}
                                src={recording.data}
                                controls
                                autoPlay={selectedRecording === index}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
}
