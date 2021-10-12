using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExchangeGame.Messaging.Messages
{
    public class LaunchMessage: Message<LaunchMessagePayload>
    {
        public LaunchMessage(): base("Launch")
        {

        }
    }

    public class LaunchMessagePayload
    {
        public string Username { get; set; }

        public string Server { get; set; }

        // TODO 'join' or 'host' use enums
        public string Type { get; set; }
    }
}
