import Attendee from "./Attendee";
import Call from "./Call";
import { generateId, getAttendees } from "../utils";

export default class Player {
  public attendees: Attendee[];
  public calls: Call[];
  public sendMessage: (message: object) => void;
  public ready: boolean = false;
  public displayName: string;
  public id: number;

  constructor(displayName: string, sendMessage: (message: object) => void) {
    this.displayName = displayName;
    this.id = generateId();
    console.log(`Player ${this.displayName} ${this.id} is in the game`)
    this.attendees = getAttendees(5, this);
    this.calls = [];
    this.sendMessage = sendMessage ?? (() => undefined);
  }

  public addCall(call: Call) {
    this.calls.push(call);
    call.onComplete.push(this.onCallComplete);
  }

  private onCallComplete = (call: Call) => {
    const idx = this.calls.indexOf(call);
    if (idx !== -1) {
      this.calls.splice(idx, 1);
    }
    this.calls.splice(idx, 1);
    console.log(`Player ${this.displayName} ${this.id} removing call ${call.displayName}`)
  }
}