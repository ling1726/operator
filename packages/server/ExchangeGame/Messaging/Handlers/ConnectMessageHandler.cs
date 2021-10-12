using ExchangeGame.Messaging.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExchangeGame.Messaging.Handlers
{
    public class ConnectMessageHandler : MessageHandler
    {
        public ConnectMessageHandler(Game game) : base(game, MessageTypes.Connection) { }

        protected override void HandleMessagePayload(MessageWrapper wrapper, string ipPort)
        {
            var payload = JsonHelpers.DeserializeMessagePayload<ConnectMessagePayload>(wrapper);

            Game.Connect(payload.Exchange, payload.Attendee);
        }
    }
}
