
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { contractList, mainNavItems } from '@/contracts/definitions';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { Bot, Package } from 'lucide-react';

export function MainNav() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-all"
        >
          <Package className="h-6 w-6" />
          <div className="flex flex-col">
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
              Web3 Scaffold
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {mainNavItems.map((item) => (
            <SidebarMenuItem key={item.page}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.page}
                tooltip={{ children: item.name, side: 'right' }}
              >
                <Link href={item.page}>
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <SidebarSeparator className="my-2" />

          {contractList.map((contract) => (
            <SidebarMenuItem key={contract.page}>
              <SidebarMenuButton
                asChild
                isActive={pathname === contract.page}
                tooltip={{ children: contract.name, side: 'right' }}
              >
                <Link href={contract.page}>
                  <contract.icon />
                  <span>{contract.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
