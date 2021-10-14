import { WebSocketServer } from "ws";
import { Request } from "./api";
import Game from "./Game";

const wss = new WebSocketServer({ port: 8080 });
let game = new Game();

function parseMessage(jsonStr: string): Request {
  const message = JSON.parse(jsonStr);
  return message as Request;
}

let connectionIds = 0;
wss.on("connection", function connection(ws, req) {
  const clientId = `${connectionIds++}`;
  console.log(`Client connected on id ${clientId}`);
  
  ws.on("message", function incoming(rawMessage) {
    const message = parseMessage(rawMessage.toString());
    console.log(`received message from client ${clientId}, ${message}`);
    switch(message.type) {
      case 'Register':
        if (game.gameOver) {
          console.log('previous game over, creating new game');
          game = new Game();
        }
        game.addPlayer(message.payload.username, clientId, ws);
        break;
      case 'Ready':
        game.playerReady(clientId);
        break;
      case 'Connect':
        game.connect(message.payload.exchange, message.payload.attendee);
        break;
      default:
        console.error(`unknown message ${message}`);
    }
  });
});
