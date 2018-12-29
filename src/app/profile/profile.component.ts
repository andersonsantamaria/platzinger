import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(private userService: UserService, private authenticationService: AuthenticationService, private angularFireStorage: AngularFireStorage) {
    this.authenticationService.getStatus().subscribe(
      (status) => {
        this.userService.getUserById(status.uid).valueChanges().subscribe(
          (data: User) => {
            this.user = data;
            console.log(this.user);
          },
          (error) => {
            console.log(error);
          }
        );
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
  }

  saveSettings() {
    if (this.croppedImage) {
      const currentPictureId = Date.now();
      const pictures = this.angularFireStorage.ref('pictures/' + currentPictureId + ".jpg").putString(this.croppedImage, 'data_url');
    } else {
      this.userService.editUser(this.user).then(
        (data) => {
          alert("Cambios guardados");
        }
      ).catch(
        (error) => {
          alert("Ocurrio un error");
          console.log(error);
        }
      );
    }

  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }

}