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

        private static string[] AttendeeNames;
        private static string[] ExchangeNames;
        private static string[] CallNames;

        private static int MAX_VALUE_COUNT = 500;

        static ContentRepository()
        {
            AttendeeNames = new string[MAX_VALUE_COUNT];
            ExchangeNames = new string[MAX_VALUE_COUNT];
            CallNames = new string[MAX_VALUE_COUNT];

            var attendeeNames = new HashSet<string>();
            while(attendeeNames.Count < MAX_VALUE_COUNT)
            {
                attendeeNames.Add(Faker.Name.First());
            }
            AttendeeNames = attendeeNames.ToArray(); ;

            for (var i = 0; i < MAX_VALUE_COUNT; i++)
            {
                ExchangeNames[i] = Faker.Address.City();
            }

            for (var i = 0; i < MAX_VALUE_COUNT; i++)
            {
                CallNames[i] = Faker.Company.Name();
            }
        }

        public static ICollection<Attendee> GetAttendees(int nb, Player player)
        {
            var people = new List<Attendee>();
            for(var i = 0; i < nb; i++)
            {
                people.Add(new Attendee(AttendeeNames[i], player));
            }

            return people;
        }

        public static ICollection<string> GetExchangeNames(int nb)
        {
            var exchanges = new List<string>();
            for (var i = 0; i < nb; i++)
            {
                exchanges.Add(ExchangeNames[i]);
            }

            return exchanges;
        }

        public static ICollection<string> GetCallNames(int nb)
        {
            var calls = new List<string>();
            for (var i = 0; i < nb; i++)
            {
                calls.Add(CallNames[i]);
            }

            return calls;
        }
    }
}
