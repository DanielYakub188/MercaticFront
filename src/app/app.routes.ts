import { Routes } from '@angular/router';

//Import Pages
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { CustomerServiceComponent } from './pages/customer-service/customer-service.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { WorkWithUsComponent } from './pages/work-with-us/work-with-us.component';
import { CatalogComponent } from './pages/catalog/catalog.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Página principal
  { path: 'conocenos', component: AboutUsComponent },
  { path: 'atencion-al-cliente', component: CustomerServiceComponent },
  {path: 'trabaja-con-nosotros', component: WorkWithUsComponent},
  { path: 'catalogo', component: CatalogComponent },
  { path: 'login', component: LoginComponent },
  // Ruta comodín para redirigir a Home si no se encuentra ninguna ruta
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
