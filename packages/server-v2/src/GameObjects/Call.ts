import Attendee from "./Attendee";
import { generateId, getRandomInt } from "../utils";

export default class Call {
  public id: number;
  public displayName: string;
  public sender: Attendee;
  public recipient: Attendee;
  public duration: number;
  public startTimestamp: number;
  public onComplete: ((call: Call) => void)[] = [];
  public onTimeout: ((call: Call) => void)[] = [];
  public score: number = 15;
  private _senderConnected: boolean = false;
  private _recipientConnected: boolean = false;
  private START_DELAY = 500;
  private timer: NodeJS.Timeout;

  constructor(displayName: string, sender: Attendee, recipient: Attendee) {
    this.displayName = displayName;
    this.id = generateId();
    this.sender = sender;
    this.recipient = recipient;
    this.duration = getRandomInt(15, 30);
    sender.inCall = true;
    recipient.inCall = true;

    this.startTimestamp = Date.now();
    this.timer = setTimeout(() => {
       this.onTimeout.forEach(cb => cb(this));
    }, this.duration + this.START_DELAY);

    console.log(
      `Call ${displayName} between ${this.sender.displayName} and ${this.recipient.displayName} duration ${this.duration}`
    );
  }

  public tryConnect(attendee: Attendee): boolean {
    let sucess = false;
    if (this.sender === attendee) {
      sucess = true;
      this._senderConnected = true;
    }

    if (this.recipient === attendee) {
      sucess = true;
      this._recipientConnected = true;
    }

    if (this.callComplete) {
      clearTimeout(this.timer);
      console.log(`Complete call: ${this.displayName}`);
      this.sender.inCall = false;
      this.recipient.inCall = false;
      this.onComplete.forEach(cb => cb(this));
    }

    return sucess;
  }

  private get callComplete() {
    return this._senderConnected && this._recipientConnected;
  }
}
