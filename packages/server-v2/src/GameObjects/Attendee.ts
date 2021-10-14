import { generateId } from "../utils";

export default class Attendee {
    public inCall: boolean = false;
    public playerId: number;
    public id: number;
    public displayName: string;

    constructor(displayName: string, playerId: number) {
        this.displayName = displayName;
        this.id = generateId();
        this.playerId = playerId;
        console.log(`Person ${displayName} is in the game`);
    }
}