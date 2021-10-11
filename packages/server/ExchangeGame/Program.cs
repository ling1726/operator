using System;
using System.Text;
using WatsonWebsocket;

namespace ExchangeGame
{
    class Program
    {
        private static string _Hostname = "localhost";
        private static int _Port = 8080;
        private static string _ClientIpPort = null;

        static void Main(string[] args)
        {
            var game = new Game();
            // game.Start();

            using (var wss = new WatsonWsServer(_Hostname, _Port, false))
            {
                wss.ClientConnected += (s, e) => Console.WriteLine("Client connected: " + e.IpPort);
                wss.ClientDisconnected += (s, e) => Console.WriteLine("Client disconnected: " + e.IpPort);
                wss.MessageReceived += (s, e) =>
                {
                    Console.WriteLine("Server message received from " + e.IpPort + ": " + Encoding.UTF8.GetString(e.Data));
                    _ClientIpPort = e.IpPort;
                };

                wss.Start();

                while(true)
                {

                }
            }
        }
    }
}
