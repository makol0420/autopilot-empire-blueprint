import { 
  LayoutDashboard, 
  Target, 
  Wrench, 
  Upload, 
  CheckSquare,
  TrendingUp,
  User
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "90-Day Roadmap", url: "/roadmap", icon: Target },
  { title: "AI Tools", url: "/tools", icon: Wrench },
  { title: "Content Hub", url: "/content", icon: Upload },
]

const businessItems = [
  { title: "Revenue Streams", url: "/revenue", icon: TrendingUp },
  { title: "Profile", url: "/profile", icon: User },
]

export function AppSidebar() {
  const { state, open, setOpen } = useSidebar()
  const collapsed = state === "collapsed"
  const location = useLocation()
  const currentPath = location.pathname
  const isMobile = useIsMobile()

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/"
    return currentPath.startsWith(path)
  }
  
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-muted/50"

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-64"} ${isMobile && !open ? "hidden" : ""}`}
      collapsible="icon"
      variant={isMobile ? "floating" : "sidebar"}
    >
      <SidebarContent className="bg-background border-r">
        <div className="p-3 sm:p-4 border-b">
          <h2 className={`font-bold text-base sm:text-lg ${collapsed ? "text-center" : ""}`}>
            {collapsed ? "💰" : "💰 Revenue Builder"}
          </h2>
        </div>

        <SidebarGroup className="px-2 py-3 sm:py-4">
          <SidebarGroupLabel className={collapsed ? "sr-only" : "text-xs uppercase tracking-wider font-medium text-muted-foreground px-3 pb-2"}>
            Main Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    onClick={() => isMobile && setOpen(false)}
                    className="w-full"
                  >
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={({ isActive }) => `${getNavCls({ isActive })} flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm w-full`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="px-2 py-3 sm:py-4">
          <SidebarGroupLabel className={collapsed ? "sr-only" : "text-xs uppercase tracking-wider font-medium text-muted-foreground px-3 pb-2"}>
            Business
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {businessItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    onClick={() => isMobile && setOpen(false)}
                    className="w-full"
                  >
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) => `${getNavCls({ isActive })} flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors text-sm w-full`}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}