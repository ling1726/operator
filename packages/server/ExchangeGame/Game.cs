using ExchangeGame.Messaging;
using ExchangeGame.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using WatsonWebsocket;

namespace ExchangeGame
{
    public class Game
    {
        public Dictionary<int, Player> Players { get; } = new Dictionary<int, Player>();

        public Dictionary<int, Exchange> Exchanges { get; } = new Dictionary<int, Exchange>();

        public int Score { get; private set; } = 0;

        public WatsonWsServer server { get; set; }

        private Random _random = new Random();

        private Dictionary<Player, HashSet<Attendee>> _availableAttendees = new Dictionary<Player, HashSet<Attendee>>();

        // TODO make this configurable
        private const int FAIL_SCORE = 100;

        // TODO make this configurable
        private const int EXCHANGE_COUNT = 3;

        public Game()
        {

            var exchangeNames = ContentRepository.GetExchangeNames(EXCHANGE_COUNT);
            foreach(var exchangeName in exchangeNames)
            {
                var newExchange = new Exchange(exchangeName, OnUpdateScore);
                Exchanges.Add(newExchange.Id, newExchange);
            }
        }

        public Player AddPlayer(Action send, string name = "Test player", string ipPort = "")
        {
            var newPlayer = new Player(name);
            Players.Add(newPlayer.Id, newPlayer);
            _availableAttendees[newPlayer] = newPlayer.Attendees.ToHashSet();
            newPlayer.SendMessage = messageStr => server.SendAsync(ipPort, messageStr);

            var message = new StartMessage(Exchanges.Values, newPlayer.Attendees);
            newPlayer.SendMessage(JsonHelpers.SerializeMessage(message));
            return newPlayer;
        }


        private Exchange GetRandomExchange()
        {
            var exchanges = Exchanges.Values.ToList();
            var idx = _random.Next(0, exchanges.Count());
            return exchanges[idx];
        }

        private void OnUpdateScore(int scoreToUpdate)
        {
            Score += scoreToUpdate;
        }

        private Call MatchCall(Player player = null)
        {
            var selectedPlayers = Players.Values.OrderBy(x => _random.Next()).Take(2).ToList();
            var senderPlayer = player ?? selectedPlayers[0];
            var recipientPlayer = selectedPlayers[1];

            var sender = _availableAttendees[senderPlayer].ElementAt(_random.Next(0, _availableAttendees[senderPlayer].Count));
            var recipient = _availableAttendees[recipientPlayer].ElementAt(_random.Next(0, _availableAttendees[recipientPlayer].Count));

            _availableAttendees[senderPlayer].Remove(sender);
            _availableAttendees[recipientPlayer].Remove(recipient);

            return new Call(ContentRepository.GetCallNames(1).First(), sender, recipient);
        }

        private void OnCallDisposed(Call call)
        {
            _availableAttendees[call.Sender.Player].Add(call.Sender);
            _availableAttendees[call.Recipient.Player].Add(call.Recipient);

            var newCall = MatchCall();
            var exchange = GetRandomExchange();
            exchange.AddCall(newCall);
            call.Sender.Player.AddCall(newCall);
            newCall.OnComplete += OnCallDisposed;
            newCall.OnTimeout += OnCallDisposed;
            Console.WriteLine($"Creating new call for ${call.Sender.Player.DisplayName}");
        }
    }
}
