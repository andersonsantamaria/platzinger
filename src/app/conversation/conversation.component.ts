import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { ConversationService } from '../services/conversation.service';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  friendId: any;
  friend: User;
  user: User;
  conversationId: string;
  textMessage: string;
  conversation: any[];

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private conversationService: ConversationService, private authenticationService: AuthenticationService) {
    this.friendId = this.activatedRoute.snapshot.params['uid'];

    this.authenticationService.getStatus().subscribe(
      (session) => {
        this.userService.getUserById(session.uid).valueChanges().subscribe(
          (user: User) => {
            this.user = user;
            this.userService.getUserById(this.friendId).valueChanges().subscribe(
              (data: User) => {
                this.friend = data;
                const ids = [this.user.uid, this.friend.uid].sort();
                this.conversationId = ids.join('|');
                this.getConversation();
              },
              (error) => {
                console.log(error)
              }
            );
          }
        );
      }
    );
  }

  ngOnInit() {
  }

  sendMessage() {
    const message = {
      uid: this.conversationId,
      timestamp: Date.now(),
      text: this.textMessage,
      sender: this.user.uid,
      receiver: this.friend.uid,
      seen: false
    };
    this.conversationService.createConversation(message).then(
      () => {
        this.textMessage = '';
      },
      () => {

      }
    );
  }

  getConversation() {
    this.conversationService.getConversation(this.conversationId).valueChanges().subscribe(
      (data) => {
        this.conversation = data;
        this.conversation.forEach(
          (message) => {
            if (message.sender != this.user.uid && !message.seen) {
              message.seen = true;
              this.conversationService.editConversation(message);
              const AUDIO = new Audio('assets/sound/new_message.m4a');
              AUDIO.play();
            }
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getNickName(uid) {
    return (uid == this.friend.uid) ? this.friend.nick : this.user.nick;
  }
}
