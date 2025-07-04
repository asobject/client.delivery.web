import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../_services/user/user.service';

export const RoleGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);

  const roles = route.data?.['roles'] as string[];
  return roles && userService.hasRole(roles);
};
