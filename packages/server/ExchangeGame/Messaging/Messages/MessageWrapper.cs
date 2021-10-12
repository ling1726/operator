using System.Text.Json;

namespace ExchangeGame.Messaging.Messages
{
    public class MessageWrapper: Message<JsonElement>
    {
        public MessageWrapper() : base("") { }
    }
}
