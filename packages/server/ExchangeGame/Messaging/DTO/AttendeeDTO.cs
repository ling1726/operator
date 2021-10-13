using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExchangeGame.Messaging.DTO
{
    public class AttendeeDTO
    {
        public AttendeeDTO(Attendee attendee)
        {
            Id = attendee.Id;
            DisplayName = attendee.DisplayName;
        }

        public int Id { get; set; }

        public string DisplayName { get; set; }
    }
}
