export interface WRTC {
  RTCPeerConnection: typeof RTCPeerConnection
  RTCSessionDescription: typeof RTCSessionDescription
  RTCIceCandidate: typeof RTCIceCandidate
}

export interface WebRTCPeerEvents {
  'signal': CustomEvent<Signal>
  'ready': CustomEvent
  'close': CustomEvent
  'ice-candidate': CustomEvent
  'error': CustomEvent<Error>
}

export { WebRTCReceiver } from './receiver.js'
export { WebRTCInitiator } from './initiator.js'
export { WebRTCPeer } from './peer.js'

export interface WebRTCPeerInit {
  id?: string
  wrtc?: WRTC
  peerConnectionConfig?: RTCConfiguration
}

export interface WebRTCReceiverInit extends WebRTCPeerInit {
  answerOptions?: RTCAnswerOptions
}

export interface WebRTCInitiatorInit extends WebRTCPeerInit {
  dataChannelLabel?: string
  dataChannelInit?: RTCDataChannelInit
  offerOptions?: RTCOfferOptions
}

export interface OfferSignal {
  type: 'offer'
  sdp: string
}

export interface AnswerSignal {
  type: 'answer'
  sdp: string
}

export interface CandidateSignal {
  type: 'candidate'
  candidate: {
    candidate: string
    sdpMLineIndex?: number
    sdpMid?: string
  }
}

export interface RenegotiateSignal {
  type: 'renegotiate'
}

export interface GoodbyeSignal {
  type: 'goodbye'
}

export type Signal = OfferSignal | AnswerSignal | CandidateSignal | RenegotiateSignal | GoodbyeSignal
