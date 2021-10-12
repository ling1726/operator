using ExchangeGame.Messaging;
using ExchangeGame.Messaging.Messages;
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

        public Dictionary<string, Player> PlayersByIp { get; } = new Dictionary<string, Player>();

        public Dictionary<int, Attendee> Attendees { get; set; } = new Dictionary<int, Attendee>();

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

        public Player AddPlayer(string name = "Test player", string ipPort = "")
        {
            var newPlayer = new Player(name);
            Players.Add(newPlayer.Id, newPlayer);
            PlayersByIp.Add(ipPort, newPlayer);
            newPlayer.SendMessage = messageStr => server.SendAsync(ipPort, messageStr);

            _availableAttendees[newPlayer] = newPlayer.Attendees.ToHashSet();
            foreach (var attendee in newPlayer.Attendees)
            {
                Attendees.Add(attendee.Id, attendee);
            }

            var message = new LobbyMessage(Players.Values);
            BroadcastMessage(JsonHelpers.SerializeMessage(message));
            
            return newPlayer;
        }

        public void PlayerReady(Player player)
        {
            player.Ready = true;
            if (Players.Values.Count > 1 && Players.Values.All(x => x.Ready))
            {
                Start();
                SendinitialCalls();
            }
        }

        public void Connect(int exchangeId, int attendeeId)
        {
            var exchange = Exchanges[exchangeId];
            var attendee = Attendees[attendeeId];
            exchange.Connect(attendee);
        }

        private void Start()
        {
            foreach (var player in Players.Values)
            {
                var message = new StartMessage(Exchanges.Values, player.Attendees);
                player.SendMessage(JsonHelpers.SerializeMessage(message));
            }
        }

        private void SendinitialCalls()
        {
            var messages = new List<string>();
            foreach(var player in Players.Values)
            {
                CreateCall(player);
            }
        }

        private void CreateCall(Player player)
        {
            var call = MatchCall(player);
            var exchange = GetRandomExchange();
            exchange.AddCall(call);
            player.AddCall(call);
            call.OnComplete += OnCallDisposed;
            call.OnTimeout += OnCallDisposed;
            var message = new CallMessage(call, exchange);
            player.SendMessage(JsonHelpers.SerializeMessage(message));
            Console.WriteLine($"Creating new call for ${call.Sender.Player.DisplayName}{call.Sender.Player.Id}");
        }

        private void BroadcastMessage(string message)
        {
            foreach(var player in Players.Values)
            {
                player.SendMessage(message);
            }
        }


        private Exchange GetRandomExchange()
        {
            var exchanges = Exchanges.Values.ToList();
            var idx = _random.Next(0, exchanges.Count());
            return exchanges[idx];
        }

        private void OnUpdateScore(int scoreToUpdate, Exchange exchange, Attendee attendee)
        {
            Score += scoreToUpdate;
            var message = new ScoreMessage(exchange, attendee, Score);
            BroadcastMessage(JsonHelpers.SerializeMessage(message));
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

            CreateCall(call.Sender.Player);
        }
    }
}
