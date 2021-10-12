using ExchangeGame.Messaging.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExchangeGame.Messaging.Messages
{
    public class LobbyMessage : Message<LobbyMessagePayload>
    {
        public LobbyMessage(ICollection<Player> players) : base(MessageTypes.Lobby) {
            Payload = new LobbyMessagePayload
            {
                Players = players.Select(x => new PlayerDTO(x)).ToList(),
            };
        }
    }

    public class LobbyMessagePayload
    {
        public ICollection<PlayerDTO> Players { get; set; }
    }
}
