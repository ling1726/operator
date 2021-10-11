using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExchangeGame.Repositories
{
    public static class ContentRepository
    {
        public static int attendeeCount = 0;

        public static int exchangeCount = 0;

        public static int callCount = 0;

        public static ICollection<Attendee> GetAttendees(int nb, Player player)
        {
            var people = new List<Attendee>();
            for(var i = 0; i < nb; i++)
            {
                people.Add(new Attendee($"Attendee {attendeeCount++ + nb}", player));
            }

            return people;
        }

        public static ICollection<string> GetExchangeNames(int nb)
        {
            var exchanges = new List<string>();
            for (var i = 0; i < nb; i++)
            {
                exchanges.Add($"Exchange {exchangeCount++ + nb}");
            }

            return exchanges;
        }

        public static ICollection<string> GetCallNames(int nb)
        {
            var calls = new List<string>();
            for (var i = 0; i < nb; i++)
            {
                calls.Add($"Call {callCount++ + nb}");
            }

            return calls;
        }
    }
}
