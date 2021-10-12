using ExchangeGame.Messaging.Messages;
using Microsoft.Extensions.Logging;

namespace ExchangeGame.Messaging.Handlers
{
    public abstract class MessageHandler
    {
        protected ILogger _logger;
        public MessageHandler(Game game, string type)
        {
            Game = game;
            Type = type;

            var loggerFactory = LoggerFactory.Create(builder =>
            {
                builder.AddConsole();
            });

            _logger = loggerFactory.CreateLogger<GameObject>();
        }

        protected Game Game { get; set; }

        protected string Type { get; set; }

        public MessageHandler Next { get; set; }

        protected abstract void HandleMessagePayload(MessageWrapper wrapper, string ipPort);

        public void HandleMessage(MessageWrapper wrapper, string ipPort)
        {
            if (wrapper.Type == Type)
            {
                HandleMessagePayload(wrapper, ipPort);
            }

            Next?.HandleMessage(wrapper, ipPort);
        }

        public MessageHandler RegisterMessageHandler(MessageHandler handler)
        {
            Next = handler;
            return Next;
        }
    }
}
