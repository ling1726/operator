namespace ExchangeGame.Messaging
{
    public class ConnectMessage: Message<ConnectMessagePayload>
    {
        public ConnectMessage(): base("Connect") {}
    }

    public class ConnectMessagePayload
    {
        public int Exchange { get; set; }

        public int Attendee { get; set; }
    }
}
