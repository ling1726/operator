using ExchangeGame.Messaging.Messages;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ExchangeGame.Messaging
{
    public static class JsonHelpers
    {
        public static MessageWrapper DeserializeMessage(string json)
        {
            return JsonSerializer.Deserialize<MessageWrapper>(json, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        }

        public static T DeserializeMessagePayload<T>(MessageWrapper wrapper)
        {
            return JsonSerializer.Deserialize<T>(wrapper.Payload.GetRawText(), new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        }

        public static string SerializeMessage<T>(Message<T> message)
        {
            return JsonSerializer.Serialize(message, new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
        }
    }
}
