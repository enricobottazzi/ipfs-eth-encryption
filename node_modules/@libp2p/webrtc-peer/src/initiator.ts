import { WebRTCPeer } from './peer.js'
import { WebRTCHandshake } from './handshake.js'
import randombytes from 'iso-random-stream/src/random.js'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { pEvent } from 'p-event'
import delay from 'delay'
import { CustomEvent } from '@libp2p/interfaces/events'
import { logger } from '@libp2p/logger'
import type { WebRTCHandshakeOptions } from './handshake.js'
import type { WebRTCInitiatorInit, AnswerSignal, Signal } from './index.js'

const log = logger('libp2p:webrtc-peer:initator')

const ICECOMPLETE_TIMEOUT = 1000

export class WebRTCInitiator extends WebRTCPeer {
  private readonly handshake: WebRTCInitiatorHandshake

  constructor (opts: WebRTCInitiatorInit = {}) {
    super({
      ...opts,
      logPrefix: 'initiator'
    })

    this.handleDataChannelEvent({
      channel: this.peerConnection.createDataChannel(
        opts.dataChannelLabel ?? uint8ArrayToString(randombytes(20), 'hex').slice(0, 7),
        opts.dataChannelInit
      )
    })

    this.handshake = new WebRTCInitiatorHandshake({
      log: this.log,
      peerConnection: this.peerConnection,
      wrtc: this.wrtc,
      offerOptions: opts.offerOptions
    })
    this.handshake.addEventListener('signal', event => {
      this.dispatchEvent(new CustomEvent('signal', { detail: event.detail }))
    })
  }

  handleSignal (signal: Signal) {
    this.handshake.handleSignal(signal).catch(err => {
      this.log('error handling signal %o %o', signal, err)
    })
  }
}

interface WebRTCInitiatorHandshakeOptions extends WebRTCHandshakeOptions {
  offerOptions?: RTCOfferOptions
}

class WebRTCInitiatorHandshake extends WebRTCHandshake {
  private readonly options: WebRTCInitiatorHandshakeOptions

  constructor (options: WebRTCInitiatorHandshakeOptions) {
    super(options)

    this.options = options
    this.status = 'idle'

    this.peerConnection.addEventListener('icecandidate', (event) => {
      if (event.candidate == null) {
        return
      }

      const signal = {
        type: 'candidate',
        candidate: {
          candidate: event.candidate.candidate,
          sdpMLineIndex: event.candidate.sdpMLineIndex,
          sdpMid: event.candidate.sdpMid
        }
      }

      log.trace('create candidate', signal)

      this.dispatchEvent(new CustomEvent('signal', {
        detail: signal
      }))
      this.dispatchEvent(new CustomEvent('ice-candidate'))
    })
  }

  async handleRenegotiate () {
    if (this.status === 'negotiating') {
      this.log('already negotiating, queueing')
      return
    }

    this.status = 'negotiating'

    const offer = await this.peerConnection.createOffer(this.options.offerOptions)

    await this.peerConnection.setLocalDescription(offer)

    // wait for at least one candidate before sending the offer
    await pEvent(this, 'ice-candidate')
    await delay(ICECOMPLETE_TIMEOUT)

    log.trace('renegotiate', this.peerConnection.localDescription)

    this.dispatchEvent(new CustomEvent('signal', {
      detail: this.peerConnection.localDescription ?? offer
    }))
  }

  async handleAnswer (signal: AnswerSignal) {
    log.trace('handle answer', signal)

    await this.peerConnection.setRemoteDescription(new this.wrtc.RTCSessionDescription(signal))
    this.status = 'idle'
  }
}
