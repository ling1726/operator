using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Timers;

namespace ExchangeGame
{
    public delegate void OnCompleteDel(Call call);

    public delegate void OnTimeoutDel(Call call);
    public class Call : GameObject
    {
        public Attendee Sender { get; private set; }

        public Attendee Recipient { get; private set; }

        private bool _senderConnected = false;

        private bool _recipientConnected = false;

        public OnCompleteDel OnComplete;

        public OnTimeoutDel OnTimeout;

        // TODO configure this
        public int Score { get; set; }

        private bool CallComplete { get { return _senderConnected && _recipientConnected; } }

        private Timer _timer;

        private int _durationMs;

        public Call(string displayName, Attendee sender, Attendee recipient): base(displayName)
        {
            Sender = sender;
            Recipient = recipient;
            var rand = new Random();
            // TODO configure this
            _durationMs = rand.Next(5000, 10000);

            sender.InCall = true;
            recipient.InCall = true;


            SetTimer();
            _logger.LogInformation($"Call {displayName} between {Sender.DisplayName} and {Recipient.DisplayName}, duration {_durationMs}");
        }

        private void SetTimer()
        {
           
            _timer = new Timer(_durationMs);
            _timer.Elapsed += (Object source, ElapsedEventArgs e) =>
            {
                _timer.Stop();
                Sender.InCall = false;
                Recipient.InCall = false;
                OnTimeout(this);
                _logger.LogInformation($"Call {DisplayName} has elapsed");
            };
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
