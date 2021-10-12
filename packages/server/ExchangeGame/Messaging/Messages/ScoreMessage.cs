namespace ExchangeGame.Messaging
{
    public class ScoreMessage: Message<ScoreMessagePayload>
    {
        public ScoreMessage(Exchange exchange, Attendee attendee, int score): base("Score")
        {
            Payload = new ScoreMessagePayload
            {
                Score = score,
                Exchange = exchange?.Id,
                Attendee = attendee?.Id,
            };
        }
    }

    public class ScoreMessagePayload
    {
        public int Score { get; set; }

        public int? Exchange { get; set; }

        public int? Attendee { get; set; }
    }
}
