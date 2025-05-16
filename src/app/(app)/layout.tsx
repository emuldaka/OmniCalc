// src/app/(app)/layout.tsx
import type { PropsWithChildren } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AiInputField } from '@/components/shared/ai-input-field';
import { ServerAiHandler } from '@/components/shared/server-ai-handler'; // Placeholder for now

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-6">
            <SidebarTrigger className="md:hidden" /> {/* Only show on mobile, sidebar has its own desktop toggle */}
            <div className="flex-1">
              {/* Page title or breadcrumbs could go here */}
            </div>
            <div className="w-full max-w-md">
              <ServerAiHandler />
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
