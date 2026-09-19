import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddPropertyComponent } from './add-property/add-property.component';
import { AdminComponent } from './admin/admin.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'add-property', component: AddPropertyComponent },
    { path: 'admin', component: AdminComponent },
    { path: '**', redirectTo: '' }
];
