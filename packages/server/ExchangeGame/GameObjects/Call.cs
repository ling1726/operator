using Microsoft.Extensions.Logging;
using System;
using System.Timers;

namespace ExchangeGame
{
    public delegate void OnCompleteDel(Call call);

    public delegate void OnTimeoutDel(Call call);
    public class Call : GameObject
    {
        public Attendee Sender { get; private set; }

        public Attendee Recipient { get; private set; }

        public int Duration { get; private set; }

        public long StartTimestamp { get; private set; }

        private bool _senderConnected = false;

        private bool _recipientConnected = false;

        public OnCompleteDel OnComplete;

        public OnTimeoutDel OnTimeout;

        // TODO configure this
        public int Score { get; set; }

        private const int START_DELAY = 500;

        private bool CallComplete { get { return _senderConnected && _recipientConnected; } }

        private Timer _timer;

        public Call(string displayName, Attendee sender, Attendee recipient): base(displayName)
        {
            Sender = sender;
            Recipient = recipient;
            var rand = new Random();
            // TODO configure this
            Duration = rand.Next(5000, 10000);

            sender.InCall = true;
            recipient.InCall = true;


            SetTimer();
            _logger.LogInformation($"Call {displayName} between {Sender.DisplayName} and {Recipient.DisplayName}, duration {Duration}");
        }

        private void SetTimer()
        {
            _timer = new Timer(Duration + START_DELAY);
            _timer.Elapsed += (Object source, ElapsedEventArgs e) =>
            {
                _timer.Stop();
                Sender.InCall = false;
                Recipient.InCall = false;
                OnTimeout(this);
                _logger.LogInformation($"Call {DisplayName} has elapsed");
            };

            DateTimeOffset now = (DateTimeOffset)DateTime.UtcNow;
            StartTimestamp = now.ToUnixTimeMilliseconds() + Convert.ToInt64(START_DELAY);
            _timer.Start();
        }

        public bool TryConnect(Attendee attendee)
        {
            var success = false;

            if (Sender == attendee)
            {
                success = true;
                _senderConnected = true;
            }

            if (Recipient == attendee)
            {
                success = true;
                _recipientConnected = true;
            }

            if (CallComplete)
            {
                _logger.LogInformation($"Complete call: {DisplayName}");
                Sender.InCall = false;
                Recipient.InCall = false;
                OnComplete(this);
            }

            return success;
        }
    }
}
