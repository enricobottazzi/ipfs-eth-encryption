import { WebRTCPeer } from './peer.js'
import { WebRTCHandshake } from './handshake.js'
import { CustomEvent } from '@libp2p/interfaces/events'
import { logger } from '@libp2p/logger'
import type { WebRTCHandshakeOptions } from './handshake.js'
import type { WebRTCReceiverInit, OfferSignal, Signal, CandidateSignal } from './index.js'

const log = logger('libp2p:webrtc-peer:receiver')

export class WebRTCReceiver extends WebRTCPeer {
  private readonly handshake: WebRTCReceiverHandshake

  constructor (opts: WebRTCReceiverInit = {}) {
    super({
      ...opts,
      logPrefix: 'receiver'
    })

    this.handshake = new WebRTCReceiverHandshake({
      log: this.log,
      peerConnection: this.peerConnection,
      wrtc: this.wrtc,
      answerOptions: opts.answerOptions
    })

    this.handshake.addEventListener('signal', event => this.dispatchEvent(new CustomEvent('signal', {
      detail: event.detail
    })))
    this.peerConnection.addEventListener('datachannel', (event) => {
      this.handleDataChannelEvent(event)
    })
  }

  handleSignal (signal: Signal) {
    this.handshake.handleSignal(signal).catch(err => {
      this.log('error handling signal %o %o', signal, err)
    })
  }
}

interface WebRTCReceiverHandshakeOptions extends WebRTCHandshakeOptions {
  answerOptions?: RTCAnswerOptions
}

class WebRTCReceiverHandshake extends WebRTCHandshake {
  private readonly options: WebRTCReceiverHandshakeOptions
  private iceCandidates: CandidateSignal[]

  constructor (options: WebRTCReceiverHandshakeOptions) {
    super(options)

    this.options = options
    this.status = 'idle'
    this.iceCandidates = []
  }

  async handleRenegotiate () {
    log.trace('renegotiate')

    this.dispatchEvent(new CustomEvent<Signal>('signal', {
      detail: {
        type: 'renegotiate'
      }
    }))
  }

  async handleOffer (signal: OfferSignal) {
    await this.peerConnection.setRemoteDescription(new this.wrtc.RTCSessionDescription(signal))

    // add any candidates we were sent before the offer arrived
    for (const candidate of this.iceCandidates) {
      await this.handleCandidate(candidate)
    }
    this.iceCandidates = []

    const answer = await this.peerConnection.createAnswer(this.options.answerOptions)

    await this.peerConnection.setLocalDescription(answer)

    log.trace('handle offer', this.peerConnection.localDescription)

    this.dispatchEvent(new CustomEvent('signal', {
      detail: this.peerConnection.localDescription ?? answer
    }))
  }

  async handleCandidate (signal: CandidateSignal) {
    if (this.peerConnection.remoteDescription == null || this.peerConnection.remoteDescription.type == null) {
      // we haven't been sent an offer yet, cache the remote ICE candidates
      this.iceCandidates.push(signal)

      return
    }

    await super.handleCandidate(signal)
  }
}
