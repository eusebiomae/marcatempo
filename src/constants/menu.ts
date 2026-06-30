import {
    LayoutDashboard,
    Timer,
    Calendar,
    FolderKanban,
    Users,
    BarChart3,
    Database,
    Settings
} from 'lucide-react'

export const menu = [

{
    label:'Dashboard',
    path:'/',
    icon:LayoutDashboard
},

{
    label:'Time Tracker',
    path:'/tracker',
    icon:Timer
},

{
    label:'Calendário',
    path:'/calendar',
    icon:Calendar
},

{
    label:'Projetos',
    path:'/projects',
    icon:FolderKanban
},

{
    label:'Clientes',
    path:'/clients',
    icon:Users
},

{
    label:'Relatórios',
    path:'/reports',
    icon:BarChart3
},

{
    label:'Backup',
    path:'/backup',
    icon:Database
},

{
    label:'Configurações',
    path:'/settings',
    icon:Settings
},

]