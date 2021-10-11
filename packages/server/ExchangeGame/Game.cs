using ExchangeGame.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ExchangeGame
{
    public class Game
    {
        public Dictionary<int, Player> Players { get; } = new Dictionary<int, Player>();

        public Dictionary<int, Exchange> Exchanges { get; } = new Dictionary<int, Exchange>();

        public int Score { get; private set; } = 0;

        private Random _random = new Random();

        private Dictionary<Player, HashSet<Attendee>> _availableAttendees = new Dictionary<Player, HashSet<Attendee>>();

        // TODO make this configurable
        private const int FAIL_SCORE = 100;

        // TODO make this configurable
        private const int EXCHANGE_COUNT = 3;

        // TODO make this configurable
        private const int PLAYER_ATTENDEE_COUNT = 5;

        // TODO remove this when integrated with client
        private const int PLAYER_COUNT = 3;

        public Game()
        {

            for(var i = 0; i < PLAYER_COUNT; i++)
            {
                var newPlayer = new Player($"Player {i}");
                Players.Add(newPlayer.Id, newPlayer);
            }

            var exchangeNames = ContentRepository.GetExchangeNames(EXCHANGE_COUNT);
            foreach(var exchangeName in exchangeNames)
            {
                var newExchange = new Exchange(exchangeName, OnUpdateScore);
                Exchanges.Add(newExchange.Id, newExchange);
            }

            foreach(var player in Players.Values)
            {
                _availableAttendees[player] = player.Attendees.ToHashSet();
            }
        }

        // TODO get reid of this once transport layer is done
        public void Start()
        {
            Console.WriteLine($"Game started, score: {Score}");

            foreach (var player in Players.Values)
            {
                var call = MatchCall();
                var exchange = GetRandomExchange();
                exchange.AddCall(call);
                player.AddCall(call);
                call.OnComplete += OnCallDisposed;
                call.OnTimeout += OnCallDisposed;
            }

            while(true)
            {
               // Main loop
            }
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
