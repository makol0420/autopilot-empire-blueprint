import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { AuthGate } from "@/components/AuthGate"
import { useIsMobile } from "@/hooks/use-mobile"
import { Menu, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/AuthProvider"
import { SchedulerRunner } from "@/components/SchedulerRunner"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const isMobile = useIsMobile()
  const { signOut } = useAuth()

  return (
    <AuthGate>
      <SidebarProvider defaultOpen={!isMobile}>
        <div className="min-h-screen flex w-full bg-background">
          <AppSidebar />
          
          <div className="flex-1 flex flex-col min-w-0">
            <header className="h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
              <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                <SidebarTrigger className="h-8 w-8 flex-shrink-0">
                  <Menu className="h-4 w-4" />
                </SidebarTrigger>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl font-semibold truncate">Revenue Builder Dashboard</h1>
                  <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Build your $5K/month business in 90 days</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            </header>
            
            {/* Background scheduler */}
            <SchedulerRunner />

            <main className="flex-1 overflow-auto">
              {children}
            </main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGate>
  )
}