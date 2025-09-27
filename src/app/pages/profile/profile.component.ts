import { Component, OnInit } from '@angular/core';
import { UserMeService } from '../../shared/services/me/user-me.service';
import { UserMeResponse } from '../../shared/models/UserMeResponse';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: UserMeResponse | null = null;
  error: string | null = null;

  constructor(private userMeService: UserMeService) { }

  ngOnInit(): void {
    this.userMeService.getUserMe().subscribe({
      next: (res) => {
        this.user = res;
      },
      error: (err) => {
        this.error = 'No se pudo cargar el perfil';
        console.error(err);
      }
    });
  }

}
