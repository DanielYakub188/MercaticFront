import { Routes } from '@angular/router';

//Import Pages
import { AboutUsComponent } from './pages/about-us/about-us.component';
import { CustomerServiceComponent } from './pages/customer-service/customer-service.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { WorkWithUsComponent } from './pages/work-with-us/work-with-us.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { RegisterComponent } from './pages/register/register.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ShoppingCartComponent } from './pages/shopping-cart/shopping-cart.component';
import { AdminPanelComponent } from './pages/admin-panel/admin-panel.component';
import { SellerPanelComponent } from './pages/seller-panel/seller-panel.component';
import { RegisterSellerComponent } from './pages/register-seller/register-seller.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Página principal
  { path: 'conocenos', component: AboutUsComponent },
  { path: 'atencion-al-cliente', component: CustomerServiceComponent },
  { path: 'trabaja-con-nosotros', component: WorkWithUsComponent},
  { path: 'catalogo', component: CatalogComponent },
  {path: 'lista-compra', component: ShoppingCartComponent},
  {path: 'perfil', component: ProfileComponent},
  { path: 'login', component: LoginComponent },
  {path:'register',component: RegisterComponent},
  {path:'registro-vendedor',component:RegisterSellerComponent},

  {path:'panel-administrador',component:AdminPanelComponent},
  {path:'panel-vendedor',component:SellerPanelComponent},
  // Ruta comodín para redirigir a Home si no se encuentra ninguna ruta
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
