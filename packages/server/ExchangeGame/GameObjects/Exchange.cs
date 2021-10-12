using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;

namespace ExchangeGame
{
    public class Exchange: GameObject
    {
        private List<Call> _calls = new List<Call>();
        private Action<int, Exchange, Attendee> _updateScore;
        
        // TODO make configurable
        private const int FAILED_CONNECTION_SCORE = 5;

        public Exchange(string displayName, Action<int, Exchange, Attendee> updateScore): base(displayName)
        {
            _updateScore = updateScore;
           _logger.LogInformation($"Exchange {DisplayName} is in the game");
        }

        public void AddCall(Call call)
        {
            call.OnComplete += OnCallComplete;
            call.OnTimeout += OnCallTimeout;
            _calls.Add(call);
        }

        private void OnCallComplete(Call call)
        {
            _calls.Remove(call);
            _logger.LogInformation($"Exchange {DisplayName} removing call {call.DisplayName}");
        }

        private void OnCallTimeout(Call call)
        {
            _calls.Remove(call);
            _updateScore(call.Score, null, null);
        }

        public bool Connect(Attendee attendee)
        {
            var sucess = false;
            foreach(var call in _calls)
            {
                if (call.TryConnect(attendee))
                {
                    sucess = true;
                    break;
                }
            }

            if (!sucess)
            {
                _updateScore(FAILED_CONNECTION_SCORE, this, attendee);
            }

            return sucess;
        }
    }
}
