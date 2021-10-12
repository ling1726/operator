using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExchangeGame.Messaging.DTO
{
    public class PlayerDTO
    {
        public string DisplayName { get; set; }

        public int Id { get; set; }

        public bool Ready { get; set; }

        public PlayerDTO(Player player)
        {
            DisplayName = player.DisplayName;
            Id = player.Id;
            Ready = player.Ready;
        }
    }
}
