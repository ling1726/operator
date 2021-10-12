using ExchangeGame.Messaging.Messages;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExchangeGame.Messaging.Handlers
{
    public class ReadyMessageHandler : MessageHandler
    {
        public ReadyMessageHandler(Game game) : base(game, MessageTypes.Ready) { }
        protected override void HandleMessagePayload(MessageWrapper wrapper, string ipPort)
        {
            var player = Game.PlayersByIp[ipPort];
            Game.PlayerReady(player);
            _logger.LogInformation($"Player {player.DisplayName} ready");
        }
    }
}
