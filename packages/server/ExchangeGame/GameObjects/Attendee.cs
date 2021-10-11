using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExchangeGame
{
    public class Attendee: GameObject
    {
        public bool InCall { get; set; }

        public Player Player { get; private set; }


        public Attendee(string displayName, Player player) : base(displayName)
        {
            Player = player;
            _logger.LogInformation($"Person {DisplayName} is in the game");
        }
    }
}
