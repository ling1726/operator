using ExchangeGame.Messaging.DTO;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ExchangeGame.Messaging
{
    public class StartMessage: Message<StartMessagePayload>
    {
       

        public StartMessage(ICollection<Exchange> exchanges, ICollection<Attendee> attendees, int score): base("Start")
        {
            var now = (DateTimeOffset)DateTime.UtcNow;

            Payload = new StartMessagePayload
            {
                Exchanges = exchanges.Select(x => new ExchangeDTO { DisplayName = x.DisplayName, Id = x.Id }).ToList(),
                Attendees = attendees.Select(x => new AttendeeDTO(x)).ToList(),
                Score = score,
                Timestamp = now.ToUnixTimeMilliseconds(),
        };
        }
    }

    public class StartMessagePayload
    {
        public ICollection<ExchangeDTO> Exchanges { get; set; }

        public ICollection<AttendeeDTO> Attendees { get; set; }

        public long Timestamp { get; set; }

        public int Score { get; set; }
    }
}
