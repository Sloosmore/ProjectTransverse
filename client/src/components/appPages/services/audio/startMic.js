export async function getAudioStream() {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioOutput = devices.find((device) => device.kind === "audiooutput");
    const audioConstraints = {
      audio: {
        deviceId: audioOutput ? { exact: audioOutput.deviceId } : undefined,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    };
    return await navigator.mediaDevices.getUserMedia(audioConstraints);
  } catch (error) {
    throw new Error("Error getting audio stream: " + error.message);
  }
}
