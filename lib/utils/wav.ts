// Browser-side audio helpers for voice feedback. The sentiment service expects 16 kHz mono
// 16-bit PCM WAV, so recordings are converted here instead of needing ffmpeg on the server.

export const WAV_SAMPLE_RATE = 16000

/** Decodes a MediaRecorder blob (webm/ogg/mp4) and resamples it to mono WAV_SAMPLE_RATE. */
export async function blobToMonoSamples(blob: Blob): Promise<Float32Array> {
  const context = new AudioContext()
  try {
    const decoded = await context.decodeAudioData(await blob.arrayBuffer())
    const length = Math.ceil(decoded.duration * WAV_SAMPLE_RATE)
    // A one-channel destination down-mixes stereo input
    const offline = new OfflineAudioContext(1, length, WAV_SAMPLE_RATE)
    const source = offline.createBufferSource()
    source.buffer = decoded
    source.connect(offline.destination)
    source.start()
    const rendered = await offline.startRendering()
    return rendered.getChannelData(0)
  } finally {
    await context.close()
  }
}

/** Encodes mono float samples in [-1, 1] as a 16-bit PCM WAV file. */
export function encodeWav(samples: Float32Array, sampleRate = WAV_SAMPLE_RATE): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2)
  const view = new DataView(buffer)
  const writeString = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i))
  }

  writeString(0, 'RIFF')
  view.setUint32(4, 36 + samples.length * 2, true)
  writeString(8, 'WAVE')
  writeString(12, 'fmt ')
  view.setUint32(16, 16, true) // fmt chunk size
  view.setUint16(20, 1, true) // PCM
  view.setUint16(22, 1, true) // mono
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * 2, true) // byte rate
  view.setUint16(32, 2, true) // block align
  view.setUint16(34, 16, true) // bits per sample
  writeString(36, 'data')
  view.setUint32(40, samples.length * 2, true)

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]))
    view.setInt16(44 + i * 2, Math.round(clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff), true)
  }
  return buffer
}
