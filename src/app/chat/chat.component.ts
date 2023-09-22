import { Component } from '@angular/core';

import * as signalr from '@microsoft/signalr'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  ListeMessage: Message[] = []

  newMessage! : string
  hubConnection! : signalr.HubConnection

  disable! : boolean

  author! : string
  ngOnInit() {
    this.hubConnection =
    new signalr.HubConnectionBuilder().withUrl("https://localhost:7135/chat").build()


    this.hubConnection.on("receiveMessage",
    (message : Message) => {
      this.ListeMessage.push(message)
    })


    this.hubConnection.start().then(() => console.log("toto")).catch((error) => console.log(error))
  }

  envoiMessage() {
    this.hubConnection.send("SendMessage", {content : this.newMessage, author : this.author})
  }

  rejoindreGroup() {
    this.hubConnection.send("JoinGroup", "lesGlandus", this.author)
    .then(() => this.disable = true)

    this.hubConnection.on("messageFromGroup",
    (message : Message) => {
      this.ListeMessage.push(message)
    })
  }

  envoiMessageAuGroup() {
    this.hubConnection.send("SendToGroup",
    {content : this.newMessage, author : this.author},
    "lesGlandus"
    )
  }
}

export interface Message {
  content : string
  author : string
}
