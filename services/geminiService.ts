
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

// Native base64 implementation for browser environment
function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export class GeminiLiveService {
  private ai?: GoogleGenAI;
  private sessionPromise: Promise<any> | null = null;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private nextStartTime: number = 0;
  private sources: Set<AudioBufferSourceNode> = new Set();
  private stream: MediaStream | null = null;

  async startSession(callbacks: {
    onOpen: () => void;
    onMessage: (text: string) => void;
    onError: (e: any) => void;
  }) {
    if (this.sessionPromise) return;

    // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      console.error("Microphone access denied", err);
      callbacks.onError(err);
      return;
    }

    this.sessionPromise = this.ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks: {
        onopen: () => {
          const source = this.inputAudioContext!.createMediaStreamSource(this.stream!);
          const scriptProcessor = this.inputAudioContext!.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) {
              int16[i] = inputData[i] * 32768;
            }
            const pcmBlob: Blob = {
              data: encode(new Uint8Array(int16.buffer)),
              // The supported audio MIME type is 'audio/pcm'.
              mimeType: 'audio/pcm;rate=16000',
            };

            // Rely on sessionPromise resolves to send realtime input.
            this.sessionPromise?.then((session) => {
              session.sendRealtimeInput({ media: pcmBlob });
            });
          };

          source.connect(scriptProcessor);
          scriptProcessor.connect(this.inputAudioContext!.destination);
          callbacks.onOpen();
        },
        onmessage: async (message: LiveServerMessage) => {
          // Handle audio transcription for text output
          if (message.serverContent?.outputTranscription) {
            callbacks.onMessage(message.serverContent.outputTranscription.text);
          }

          const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (base64Audio) {
            this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext!.currentTime);
            const audioBuffer = await decodeAudioData(
              decode(base64Audio),
              this.outputAudioContext!,
              24000,
              1
            );
            const source = this.outputAudioContext!.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.outputAudioContext!.destination);
            source.addEventListener('ended', () => this.sources.delete(source));
            
            // Scheduling each new audio chunk to start at nextStartTime ensures smooth playback.
            source.start(this.nextStartTime);
            this.nextStartTime = this.nextStartTime + audioBuffer.duration;
            this.sources.add(source);
          }

          if (message.serverContent?.interrupted) {
            for (const source of this.sources.values()) {
              source.stop();
              this.sources.delete(source);
            }
            this.nextStartTime = 0;
          }
        },
        onerror: (e) => {
          console.debug('got error');
          callbacks.onError(e);
        },
        onclose: () => {
          this.sessionPromise = null;
        }
      },
      config: {
        responseModalities: [Modality.AUDIO],
        outputAudioTranscription: {},
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
        systemInstruction: 'Você é o assistente virtual da VisionStream TV. Ajude o usuário a encontrar canais, explicar o que está passando e ser um companheiro de TV amigável em português do Brasil.',
      }
    });
  }

  stopSession() {
    if (this.sessionPromise) {
      this.sessionPromise.then(s => s.close());
      this.sessionPromise = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    this.sources.forEach(s => s.stop());
    this.sources.clear();
  }
}

export const geminiLive = new GeminiLiveService();
