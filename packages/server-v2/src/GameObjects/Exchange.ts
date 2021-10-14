import { generateId } from "../utils";
import Attendee from "./Attendee";
import Call from "./Call";
import GameObject from "./GameObject";

type UpdateScoreCallback =(diff: number, exchange?: Exchange, attendee?: Attendee) => void; 

export default class Exchange {
  public id: number;
  public displayName: string;
  private _calls: Call[] = [];
  private _updateScore: UpdateScoreCallback
  private FAILED_CONNECTION_SCORE = 5;

  constructor(displayName: string, updateScore: UpdateScoreCallback) {
    this.displayName = displayName;
    this.id = generateId();
    this._updateScore = updateScore;
    console.log(`Exchange ${this.displayName} is in the game`);
  }

  public addCall(call: Call) {
    call.onComplete.push(this.onCallComplete);
    call.onTimeout.push(this.onCallTimeout);
    this._calls.push(call);
  }

  public connect(attendee: Attendee): boolean {
    let sucess = false;
    for(let i=0;i<this._calls.length;i++) {
      if (this._calls[i].tryConnect(attendee)) {
        sucess = true;
        break;
      }
    }

    if (!sucess) {
      this._updateScore(this.FAILED_CONNECTION_SCORE, this, attendee);
    }

    return sucess;
  }

  private onCallComplete = (call: Call) => {
    const idx = this._calls.indexOf(call);
    if (idx !== -1) {
      this._calls.splice(idx, 1);
    }
    console.log(`Exchange ${this.displayName} removing call ${call.displayName}`)
  }

  private onCallTimeout = (call: Call) => {
    const idx = this._calls.indexOf(call);
    if (idx !== -1) {
      this._calls.splice(idx, 1);
    }
    this._calls.splice(idx, 1);
    this._updateScore(call.score);
  }
}