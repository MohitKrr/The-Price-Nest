import { Component, inject } from '@angular/core';
import { User } from '../Models/user';
import { HttpClient , HttpClientModule} from '@angular/common/http';
import { Userservice } from '../services/userservice';


@Component({
  selector: 'app-show-user',
  standalone: true,      
  imports: [HttpClientModule],       
  templateUrl: './show-user.html',
  styleUrl: './show-user.css'
})
export class ShowUser {
  isEdit:boolean = false;
  users:Array<User> = [];
//os instance of userservice class
 os = inject(Userservice)
  constructor() {  
     this.users = this.os.getUser();
   }
   editHandler(){
    this.isEdit = true
  }


}
