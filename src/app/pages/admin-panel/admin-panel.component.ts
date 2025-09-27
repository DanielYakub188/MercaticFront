import { AdminService } from './../../shared/services/admin/admin.service';
import { Component } from '@angular/core';
import { UserMeResponse } from '../../shared/models/UserMeResponse';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

// 👇 Esto declara bootstrap como variable global
declare var bootstrap: any;

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent {
  users: UserMeResponse[] = [];
  page: number = 0;
  size: number = 10;
  searchText: string = '';
  sortBy: string = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  selectedUser: UserMeResponse | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsers(this.page, this.size, this.searchText, this.sortBy, this.sortDirection)
      .subscribe(data => {
        this.users = data;
      });
  }
  saveUser() {
    if (!this.selectedUser) return;

    this.adminService.updateUser(this.selectedUser).subscribe({
      next: updated => {
        const index = this.users.findIndex(u => u.id === updated.id);
        if (index > -1) this.users[index] = updated;

        const modalEl = document.getElementById('editUserModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
      },
      error: err => console.error('Error al actualizar:', err)
    });
  }


  nextPage() {
    this.page++;
    this.loadUsers();
  }

  prevPage() {
    if (this.page > 0) this.page--;
    this.loadUsers();
  }

  sort(column: string) {
    if (this.sortBy === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = column;
      this.sortDirection = 'asc';
    }
    this.loadUsers();
  }

  openModal(user: UserMeResponse) {
    this.selectedUser = { ...user };
    const modalEl = document.getElementById('editUserModal');
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  }


}
