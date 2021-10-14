using ExchangeGame.Messaging;
using ExchangeGame.Messaging.Handlers;
using System;
using System.Collections.Concurrent;
using System.Text;
using WatsonWebsocket;

namespace ExchangeGame
{
    class Program
    {
        private static string _Hostname = "127.0.0.1";
        private static int _Port = 8080;

        private static ConcurrentQueue<(string messageStr, string ipPort)> messageQueue = new ConcurrentQueue<(string messageStr, string ipPort)>();

        static void Main(string[] args)
        {
            var game = new Game();
            var handler = new LaunchMessageHandler(game);
            handler
                .RegisterMessageHandler(new ReadyMessageHandler(game))
                .RegisterMessageHandler(new ConnectMessageHandler(game));

            using (var wss = new WatsonWsServer(_Hostname, _Port, false))
            {
                wss.ClientConnected += (s, e) => Console.WriteLine("Client connected: " + e.IpPort);
                wss.ClientDisconnected += (s, e) => Console.WriteLine("Client disconnected: " + e.IpPort);
                wss.MessageReceived += (s, e) =>
                {
                    var jsonString = Encoding.UTF8.GetString(e.Data);
                    Console.WriteLine("Server message received from " + e.IpPort + ": " + jsonString);
                    messageQueue.Enqueue((jsonString, e.IpPort));
                };

                game.server = wss;
                wss.Start();

                while(true)
                {
                    if (!messageQueue.IsEmpty && messageQueue.TryDequeue(out var entry))
                    {
                        var message = JsonHelpers.DeserializeMessage(entry.messageStr);
                        handler.HandleMessage(message, entry.ipPort);
                    }

                    if (game.GameOver)
                    {
                        messageQueue.Clear();
                        game = new Game();
                        game.server = wss;
                    }
                }
            }
        }
    }
}
