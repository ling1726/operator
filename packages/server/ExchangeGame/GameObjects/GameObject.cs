using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExchangeGame
{
    public class GameObject
    {
        public int Id { get; private set; }

        public string DisplayName { get; private set; }

        protected ILogger _logger;

        public GameObject(string displayName)
        {
            DisplayName = displayName;
            Id = IdGenerator.GenerateId();

            var loggerFactory = LoggerFactory.Create(builder =>
            {
                builder.AddConsole();
            });

            _logger = loggerFactory.CreateLogger<GameObject>();
        }
    }
}
