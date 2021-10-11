using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExchangeGame
{
    public static class IdGenerator
    {
        private static int id = 1;
        public static int GenerateId()
        {
            return id++;
        }
    }
}
