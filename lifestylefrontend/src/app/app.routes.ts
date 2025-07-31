import { Routes } from '@angular/router';
import { ShowUser } from './show-user/show-user';
// import { Home } from './home/home';
import { Login } from './login/login';
import { About } from './about/about';
import { Lifestyles } from './Component/lifestyles/lifestyles';
import { Hero } from './Component/hero/hero';
import { Countries } from './Component/countries/countries';
import { Comparision } from './Component/comparision/comparision';
import { Favourite } from './favourite/favourite';
import { Register } from './register/register';
import { Profile } from './Component/profile/profile';
import { unauthorizedGuardGuard } from './guards/unauthorized-guard-guard';
import { ForgotPassword } from './forgot-password/forgot-password';

export const routes: Routes = [
    
    // {path:"show-user",component:ShowUser}, 
    { path: 'show-user', loadChildren: () => import('./Models/user-profile.js').then(m => m.UserProfile) },
    {path:"register",component:Register}, 
    {path:"login",component:Login}, 
    {path:"about",component:About},
    {path:"forgot-password",component:ForgotPassword},
    {path:"countries",component:Countries},
    {path:"comparision", component:Comparision},
    {path:"favourite",component:Favourite, canActivate:[unauthorizedGuardGuard]},
    {path:"profile", component:Profile,canActivate:[unauthorizedGuardGuard]},
    {path:"",component:Hero}
];
