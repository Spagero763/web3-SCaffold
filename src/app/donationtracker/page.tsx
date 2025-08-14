
'use client';
import { PageHeader } from "@/components/page-header";
import { contracts } from "@/contracts/definitions";
import { ContractCard } from "@/components/contract/contract-card";
import { FunctionForm } from "@/components/contract/function-form";
import { ReadFunction } from "@/components/contract/read-function";
import { EventLogs } from "@/components/contract/event-logs";
import { Eye, History, Pencil, Info, ListChecks, Hash, BadgeDollarSign, HeartHandshake } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";
import { Badge } from "@/components/ui/badge";

const idSchema = z.object({
    id: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, { message: "ID must be a positive number." }),
});


export default function DonationTrackerPage() {
    const contract = contracts.donationTracker;

    const [causeId, setCauseId] = useState<bigint | undefined>();

    const idForm = useForm<z.infer<typeof idSchema>>({
        resolver: zodResolver(idSchema),
        defaultValues: { id: "" },
    });
    
    const { data: cause, refetch: refetchCause } = useReadContract({
        abi: contract.abi,
        address: contract.address,
        functionName: 'causes',
        args: [causeId],
        query: { enabled: causeId !== undefined }
    });

    const onIdSubmit = (values: z.infer<typeof idSchema>) => {
        setCauseId(BigInt(values.id));
        refetchCause();
    };

    const causeCountAbi = contract.abi.find(item => item.name === 'causeCount');
    const writeFunctions = contract.abi.filter(item => item.type === 'function' && (item.stateMutability === 'nonpayable' || item.stateMutability === 'payable'));
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
                        {causeCountAbi && (
                             <ContractCard title="Total Causes" description="Total number of causes registered." icon={ListChecks}>
                                <ReadFunction abiItem={causeCountAbi} contractAddress={contract.address} />
                           </ContractCard>
                        )}

                        <ContractCard title="View Cause" description="Fetch a specific cause by its ID." icon={HeartHandshake}>
                            <Form {...idForm}>
                                <form onSubmit={idForm.handleSubmit(onIdSubmit)} className="space-y-4">
                                    <FormField
                                        control={idForm.control}
                                        name="id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cause ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" {...field} type="number" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Get Cause</Button>
                                </form>
                            </Form>
                            {causeId !== undefined && cause && Array.isArray(cause) && cause[3] && (
                                <div className="mt-4 p-4 border rounded-lg bg-secondary/50 space-y-2">
                                    <h3 className="font-bold text-lg">{cause[0] as string}</h3>
                                    <p className="text-sm font-mono break-all"><b>Beneficiary:</b> {cause[1] as string}</p>
                                    <p className="text-sm font-mono"><b>Total Received:</b> {formatEther(cause[2] as bigint)} ETH</p>
                                </div>
                            )}
                             {causeId !== undefined && cause && Array.isArray(cause) && !cause[3] && (
                                <div className="mt-4 p-4 border rounded-lg bg-secondary/50 space-y-2">
                                    <p className="text-sm text-muted-foreground">Cause with ID {causeId.toString()} not found.</p>
                                </div>
                             )}
                        </ContractCard>
                    </div>
                </div>
            </div>
        </div>
    )
}
