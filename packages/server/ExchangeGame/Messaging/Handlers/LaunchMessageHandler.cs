using ExchangeGame.Messaging.Messages;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ExchangeGame.Messaging.Handlers
{
    public class LaunchMessageHandler: MessageHandler
    {
        public LaunchMessageHandler(Game game) : base(game, MessageTypes.Launch) { }

        protected override void HandleMessagePayload(MessageWrapper wrapper, string ipPort)
        {
            var payload = JsonHelpers.DeserializeMessagePayload<ConnectionMessagePayload>(wrapper);

            Game.AddPlayer(payload.Username, ipPort);
        }
    }
}
