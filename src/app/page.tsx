import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { contractList, mainNavItems } from '@/contracts/definitions';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const allItems = [...mainNavItems.slice(1), ...contractList];

  return (
    <div>
      <PageHeader
        title="Welcome to Web3 Scaffold"
        description="Your starting point for building powerful decentralized applications. Explore pre-built contract interactions or generate your own with AI."
      />
      <div className="grid gap-6 p-4 md:p-6 lg:p-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allItems.map((item) => (
          <Card key={item.page} className="flex flex-col transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
               <item.icon className="h-8 w-8 text-primary" />
               <CardTitle className="text-xl">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <CardDescription>{(item as any).description || `Navigate to the ${item.name} page.`}</CardDescription>
            </CardContent>
            <div className="p-6 pt-0">
               <Button asChild className="w-full">
                <Link href={item.page}>
                  Open <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
