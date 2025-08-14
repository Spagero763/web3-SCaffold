import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

type ContractCardProps = {
    title: string | React.ReactNode;
    description: string;
    icon: LucideIcon;
    children: React.ReactNode;
}

export function ContractCard({ title, description, icon: Icon, children }: ContractCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="bg-primary/10 p-2 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="grid gap-1">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
        </Card>
    )
}
