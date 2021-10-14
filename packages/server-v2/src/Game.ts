import { WebSocket } from "ws";
import { Response } from "./api";
import Attendee from "./GameObjects/Attendee";
import Call from "./GameObjects/Call";
import Exchange from "./GameObjects/Exchange";
import Player from "./GameObjects/Player";
import { getCallNames, getExchangeNames, getRandomInt } from "./utils";

export default class Game {
  public gameOver: boolean = false;
  public players: Record<number, Player> = {};
  public playersByConnection: Record<string, Player> = {};
  public connections: Record<number, WebSocket> = {};
  public exchanges: Record<number, Exchange> = {};
  public attendees: Record<number, Attendee> = {};
  public score: number = 0;
  private _availableAttendees: Record<number, Set<Attendee>> = {};
  private FAIL_SCORE = 100;
  private EXCHANGE_COUNT = 3;

  constructor() {
    const exchangeNames = getExchangeNames(this.EXCHANGE_COUNT);
    exchangeNames.forEach((name) => {
      const newExchange = new Exchange(name, this.onUpdateScore);
      this.exchanges[newExchange.id] = newExchange;
      return newExchange;
    });
  }

  public addPlayer(name: string, connectionId: string, ws: WebSocket) {
    const newPlayer = new Player(name, (message: object) =>
      ws.send(JSON.stringify(message))
    );
    this.players[newPlayer.id] = newPlayer;
    this.playersByConnection[connectionId] = newPlayer;

    this._availableAttendees[newPlayer.id] = new Set(newPlayer.attendees);
    newPlayer.attendees.forEach((attendee) => {
      this.attendees[attendee.id] = attendee;
    });

    const message: Response = {
      type: "Lobby",
      payload: {
        players: Object.values(this.players).map((player) => ({
          displayName: player.displayName,
          id: player.id,
          ready: player.ready,
        })),
      },
    };
    this.broadcastMessage(message);
  }

  public playerReady(connectionId: string) {
    const player = this.playersByConnection[connectionId];
    player.ready = true;
    const message: Response = {
      type: "Lobby",
      payload: {
        players: Object.values(this.players).map((player) => ({
          displayName: player.displayName,
          id: player.id,
          ready: player.ready,
        })),
      },
    };
    this.broadcastMessage(message);
    const playerValues = Object.values(this.players);
    if (playerValues.length > 1 && playerValues.every((x) => x.ready)) {
      this.start();
      this.sendInitialCalls();
    }
  }

  public connect(exchangeId: number, attendeeId: number) {
    const exchange = this.exchanges[exchangeId];
    const attendee = this.attendees[attendeeId];
    console.log(
      `connecting ${attendee.displayName} with ${exchange.displayName}`
    );
    exchange.connect(attendee);
  }

  public start() {
    Object.values(this.players).forEach((player) => {
      const message: Response = {
        type: "Start",
        payload: {
          exchanges: Object.values(this.exchanges).map((exchange) => ({
            id: exchange.id,
            displayName: exchange.displayName,
          })),
          attendees: Object.values(player.attendees).map((attendee) => ({
            id: attendee.id,
            displayName: attendee.displayName,
          })),
          score: this.score,
          timestamp: Date.now(),
        },
      };
      player.sendMessage(message);
    });
  }

  private sendInitialCalls() {
    const messages = [];

    Object.values(this.players).forEach((player) => {
      this.createCall(player);
    });
  }

  private createCall(player: Player) {
    const call: Call = this.matchCall(player);
    const exchange = this.getRandomExchange();
    player.addCall(call);
    exchange.addCall(call);
    call.onComplete.push(this.onCallDisposed);
    call.onTimeout.push(this.onCallDisposed);

    const message: Response = {
      type: "Mission",
      payload: {
        callee: {
          id: call.recipient.id,
          displayName: call.recipient.displayName,
        },
        caller: {
          id: call.sender.id,
          displayName: call.sender.displayName,
        },
        displayName: call.displayName,
        duration: call.duration,
        exchange: exchange.id,
        id: call.id,
        timestamp: call.startTimestamp,
      },
    };
    player.sendMessage(message);
    console.log(
      `Creating new call for ${
        this.players[call.sender.playerId].displayName
      } ${this.players[call.sender.playerId].id}`
    );
  }

  private broadcastMessage(message: object) {
    Object.values(this.players).forEach((player) => {
      player.sendMessage(message);
    });
  }

  private getRandomExchange(): Exchange {
    const exchanges = Object.values(this.exchanges);
    return exchanges[getRandomInt(0, exchanges.length)];
  }

  private onUpdateScore = (
    scoreToUpdate: number,
    exchange?: Exchange,
    attendee?: Attendee
  ) => {
    this.score += scoreToUpdate;
    if (this.score >= this.FAIL_SCORE) {
      this.setGameOver();
    } else {
      const message: Response = {
        type: "Score",
        payload: {
          score: this.score,
          attendee: attendee?.id ?? 1,
          exchange: exchange?.id ?? 1,
        },
      };
      this.broadcastMessage(message);
    }
  };

  private setGameOver() {
    this.gameOver = true;
    const message: Response = {
      type: "GameOver",
      payload: { timestamp: Date.now() },
    };
    this.broadcastMessage(message);
  }

  private matchCall(senderPlayer: Player): Call {
    const playersToSelect = Object.values(this.players)
      .map((player) => (player === senderPlayer ? null : player))
      .filter(Boolean) as Player[];

    const recipientPlayer =
      playersToSelect[getRandomInt(0, playersToSelect.length)];

    const sender = Array.from(
      this._availableAttendees[senderPlayer.id].values()
    )[getRandomInt(0, this._availableAttendees[senderPlayer.id].size)];
    const recipient = Array.from(
      this._availableAttendees[recipientPlayer.id].values()
    )[getRandomInt(0, this._availableAttendees[recipientPlayer.id].size)];

    this._availableAttendees[senderPlayer.id].delete(sender);
    this._availableAttendees[senderPlayer.id].delete(recipient);

    return new Call(getCallNames(1)[0], sender, recipient);
  }

  private onCallDisposed = (call: Call) => {
    this._availableAttendees[call.sender.playerId].add(call.sender);
    this._availableAttendees[call.recipient.playerId].add(call.recipient);

    if (!this.gameOver) {
      this.createCall(this.players[call.sender.playerId]);
    }
  };
}
