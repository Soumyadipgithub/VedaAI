interface SpeechRecognitionEventResult {
  transcript: string;
}
interface SpeechRecognitionEventResultList {
  readonly length: number;
  [index: number]: { [index: number]: SpeechRecognitionEventResult } & {
    readonly length: number;
  };
}
interface SpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionEventResultList;
}
interface SpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown) | null;
  onend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => unknown) | null;
  start(): void;
  stop(): void;
}
declare const SpeechRecognition: { new (): SpeechRecognition };
