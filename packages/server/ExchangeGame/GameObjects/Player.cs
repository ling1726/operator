using ExchangeGame.Messaging;
using ExchangeGame.Repositories;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExchangeGame
{

    public class Player: GameObject
    {
        public ICollection<Attendee> Attendees { get; private set; }

        public ICollection<Call> Calls { get; private set; }

        public Action<string> SendMessage { get; set; }

        public Player(string displayName, Action<string> sendMessage = null) : base(displayName)
        {
            _logger.LogInformation($"Player {DisplayName} is in the game");
            Attendees = ContentRepository.GetAttendees(5, this);
            Calls = new List<Call>();

            SendMessage = sendMessage ?? _defaultSendMessage;
        }

        private Action<string> _defaultSendMessage = message => { };

        public void AddCall(Call call)
        {
            Calls.Add(call);
            call.OnComplete += OnCallComplete;
        }

        private void OnCallComplete(Call call)
        {
            Calls.Remove(call);
            _logger.LogInformation($"Player {DisplayName} removing call {call.DisplayName}");
        }
    }
}
