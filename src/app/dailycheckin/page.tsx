
'use client';
import { PageHeader } from "@/components/page-header";
import { contracts } from "@/contracts/definitions";
import { ContractCard } from "@/components/contract/contract-card";
import { FunctionForm } from "@/components/contract/function-form";
import { ReadFunction } from "@/components/contract/read-function";
import { EventLogs } from "@/components/contract/event-logs";
import { Eye, History, Pencil, User, TrendingUp, CalendarClock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useReadContract, useAccount } from "wagmi";

const addressSchema = z.object({
    address: z.string().startsWith('0x', "Address must start with 0x.").optional().or(z.literal('')),
});

export default function DailyCheckinPage() {
    const contract = contracts.dailyCheckin;
    const { address: connectedAddress } = useAccount();

    const [queryAddress, setQueryAddress] = useState<`0x${string}` | undefined>();

    const form = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
    });

    const { data: streak, refetch: refetchStreak } = useReadContract({
        abi: contract.abi,
        address: contract.address,
        functionName: 'streak',
        args: [queryAddress],
        query: { enabled: !!queryAddress }
    });

    const { data: lastCheckIn, refetch: refetchLastCheckIn } = useReadContract({
        abi: contract.abi,
        address: contract.address,
        functionName: 'lastCheckIn',
        args: [queryAddress],
        query: { enabled: !!queryAddress }
    });
    
    const onSubmit = (values: z.infer<typeof addressSchema>) => {
        const addressToQuery = (values.address || connectedAddress) as `0x${string}` | undefined;
        if (addressToQuery) {
            setQueryAddress(addressToQuery);
            setTimeout(() => {
                refetchStreak();
                refetchLastCheckIn();
            }, 100)
        }
    };

    const writeFunctions = contract.abi.filter(item => item.type === 'function' && (item.stateMutability === 'nonpayable' || item.stateMutability === 'payable'));
    const constantReadFunctions = contract.abi.filter(item => item.type === 'function' && item.stateMutability === 'view' && item.inputs.length === 0);
    const events = contract.abi.filter(item => item.type === 'event');
    
    return (
        <div>
            <PageHeader title={contract.name} description={contract.description} icon={contract.icon} />
            <div className="grid gap-6 p-4 md:p-6 lg:p-8">
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-6">
                        {writeFunctions.length > 0 && writeFunctions.map(item => (
                            <ContractCard
                                key={item.name}
                                title={item.name}
                                description={`Execute the ${item.name} function.`}
                                icon={Pencil}
                            >
                                <FunctionForm abiItem={item} contractAddress={contract.address} />
                            </ContractCard>
                        ))}
                         {events.length > 0 && (
                           <ContractCard title="Events" description="Listen to live contract events." icon={History}>
                               <div className="space-y-4">
                                   {events.map(item => (
                                       <EventLogs key={item.name} abi={contract.abi} contractAddress={contract.address} eventName={item.name} />
                                   ))}
                               </div>
                           </ContractCard>
                       )}
                    </div>

                    <div className="space-y-6">
                        <ContractCard title="Check Status" description="Check the streak and last check-in time for an address." icon={User}>
                             <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address (optional)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder={connectedAddress || "0x..."} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Query Status</Button>
                                </form>
                            </Form>
                            {queryAddress && (
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/50">
                                         <div className="flex items-center gap-4">
                                            <TrendingUp className="h-6 w-6 text-muted-foreground" />
                                            <span className="font-bold">Streak</span>
                                         </div>
                                        <span className="font-mono text-lg">{streak?.toString() ?? '0'} days</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 border rounded-lg bg-secondary/50">
                                        <div className="flex items-center gap-4">
                                            <CalendarClock className="h-6 w-6 text-muted-foreground" />
                                            <span className="font-bold">Last Check-in</span>
                                        </div>
                                        <span className="font-mono text-sm">
                                            {lastCheckIn ? new Date(Number(lastCheckIn) * 1000).toLocaleString() : 'Never'}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </ContractCard>

                        {constantReadFunctions.length > 0 && (
                           <ContractCard title="Contract Constants" description="Constant values defined in the contract." icon={Eye}>
                               <div className="space-y-4">
                                   {constantReadFunctions.map(item => (
                                       <div key={item.name}>
                                            <h4 className="font-medium font-mono text-sm mb-1">{item.name}</h4>
                                            <ReadFunction abiItem={item} contractAddress={contract.address} />
                                       </div>
                                   ))}
                               </div>
                           </ContractCard>
                       )}
                    </div>
                </div>
            </div>
        </div>
    )
}
