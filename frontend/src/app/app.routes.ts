import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { AdminComponent } from './admin/admin.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'add-property', component: AddPropertyComponent, canActivate: [authGuard] },
    { path: 'admin', component: AdminComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];
