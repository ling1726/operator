using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExchangeGame.Messaging.Messages
{
    public class GameOverMessage: Message<GameOverMessagePayload>
    {
        public GameOverMessage(): base(MessageTypes.GameOver) { }
    }

    public class GameOverMessagePayload { }
}
