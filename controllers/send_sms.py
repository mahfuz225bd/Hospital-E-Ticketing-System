from twilio.rest import Client

def send_sms(message, to):
    account_sid = 'AC0c3b046145c1886babbeb1e8d59f8dc8'
    auth_token = '17f13346e591dc6d0dee9b272b6f8700'
    
    client = Client(account_sid, auth_token)
    
    receiver_phone_no = to if to.startswith("+88") else  "+88" + to

    message = client.messages.create(
        from_='+12177182574',
        body=message,
        to=receiver_phone_no
    )

    print(message.sid)