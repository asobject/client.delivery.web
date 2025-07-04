import {Component, OnInit} from '@angular/core';
import {Menubar} from 'primeng/menubar';
import {Button, ButtonDirective} from 'primeng/button';
import {MenuItem} from 'primeng/api';
import {RouterLink} from '@angular/router';
import {Menu} from 'primeng/menu';
import {AuthService} from '../../_services/auth/auth.service';
import {UserService} from '../../_services/user/user.service';
import {NgIf} from '@angular/common';
import {StorageService} from '../../_services/storage/storage.service';
import {JwtService} from '../../_services/auth/jwt.service';

@Component({
  selector: 'app-header',
  imports: [
    Menubar,
    ButtonDirective,
    RouterLink,
    Menu,
    Button,
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  menuBar: MenuItem[] | undefined;
  profileMenu: MenuItem[] | undefined;

  constructor(
    private authService: AuthService,
    public userService: UserService,
    public storageService: StorageService,
    private jwtDecode:JwtService
  ) {
  }

  get firstName() {
    const token = this.storageService.accessToken;
    if (token) {
     return  this.jwtDecode.decodeToken(token)?.firstName!;
    }
    return 'Пользователь';
  }
  ngOnInit() {

    this.menuBar = [
      {
        label: 'Наши пункты',
        icon: 'pi pi-map-marker',
        routerLink: '/offices'
      },
      {
        label: 'О нас',
        icon: 'pi pi-info',
        routerLink: '/about'
      },
    ];
    this.profileMenu = [
      {
        label: 'Профиль',
        items: [
          {
            label: 'Личный кабинет',
            icon: 'pi pi-user',
            routerLink: '/user'
          },
          {
            label: 'Ваши доставки',
            icon: 'pi pi-truck',
            routerLink: '/user/orders'
          },
          {
            label: 'Выйти',
            icon: 'pi pi-sign-out',
            command:()=>{
              this.onLogout();
            }
          }
        ]
      }]
  }

  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
      },
      error: () => {
      }
    });
  }
}
