using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExchangeGame.Messaging
{
    public class Message<T>
    {
        public string Type { get; set; }

        public T Payload { get; set; }

        public Message(string type)
        {
            Type = type;
        }
    }
}
