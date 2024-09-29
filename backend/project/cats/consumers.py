import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f"chat_{self.room_name}"
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        print(f"User joined room: {self.room_group_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        print(f"User left room: {self.room_group_name}")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        
        message = text_data_json['text']
        username = text_data_json['sender']
        timestamp = text_data_json['timestamp']

        print(f"Received message: {message} from {username} at {timestamp}")

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.message',
                'text': message,
                'sender': username,
                'timestamp': timestamp,
            }
        )

    async def chat_message(self, event):
        message = event['text']
        username = event['sender']
        timestamp = event['timestamp']

        print(f"Sending message: {message} from {username} at {timestamp}")

        await self.send(text_data=json.dumps({
            'text': message,
            'sender': username,
            'timestamp': timestamp,
        }))