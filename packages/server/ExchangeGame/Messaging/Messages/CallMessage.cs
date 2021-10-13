using ExchangeGame.Messaging.DTO;
using ExchangeGame.Messaging.Messages;

namespace ExchangeGame.Messaging
{
    public class CallMessage: Message<CallMessagePayload>
    {

        public CallMessage(Call call, Exchange exchange): base(MessageTypes.Mission)
        {
            Payload = new CallMessagePayload
            {
                Id = call.Id,
                Caller = new AttendeeDTO(call.Sender),
                Callee = new AttendeeDTO(call.Recipient),
                DisplayName = call.DisplayName,
                Duration = call.Duration,
                Exchange = exchange.Id,
                Timestamp = call.StartTimestamp,
            };
        }
    }

    public class CallMessagePayload
    {
        public int Id { get; set; }

        public AttendeeDTO Caller { get; set; }

        public AttendeeDTO Callee { get; set; }

        public int Exchange { get; set; }

        public double Timestamp { get; set; }

        public int Duration { get; set; }

        public string DisplayName { get; set; }
    }
}
