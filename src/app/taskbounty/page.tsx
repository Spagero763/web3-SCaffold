'use client';
import { PageHeader } from "@/components/page-header";
import { contracts } from "@/contracts/definitions";
import { ContractCard } from "@/components/contract/contract-card";
import { FunctionForm } from "@/components/contract/function-form";
import { ReadFunction } from "@/components/contract/read-function";
import { EventLogs } from "@/components/contract/event-logs";
import { Eye, History, Pencil, Info, ListChecks, Hash, BadgeDollarSign } from "lucide-react";
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

export default function TaskBountyPage() {
    const contract = contracts.taskBounty;

    const [bountyId, setBountyId] = useState<bigint | undefined>();

    const idForm = useForm<z.infer<typeof idSchema>>({
        resolver: zodResolver(idSchema),
        defaultValues: { id: "" },
    });
    
    const { data: bounty, refetch: refetchBounty } = useReadContract({
        abi: contract.abi,
        address: contract.address,
        functionName: 'bounties',
        args: [bountyId],
        query: { enabled: bountyId !== undefined }
    });

    const onIdSubmit = (values: z.infer<typeof idSchema>) => {
        setBountyId(BigInt(values.id));
        refetchBounty();
    };

    const bountyCountAbi = contract.abi.find(item => item.name === 'bountyCount');
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
                        {bountyCountAbi && (
                             <ContractCard title="Total Bounties" description="Total number of bounties created." icon={ListChecks}>
                                <ReadFunction abiItem={bountyCountAbi} contractAddress={contract.address} />
                           </ContractCard>
                        )}

                        <ContractCard title="View Bounty" description="Fetch a specific bounty by its ID." icon={Info}>
                            <Form {...idForm}>
                                <form onSubmit={idForm.handleSubmit(onIdSubmit)} className="space-y-4">
                                    <FormField
                                        control={idForm.control}
                                        name="id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bounty ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" {...field} type="number" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Get Bounty</Button>
                                </form>
                            </Form>
                            {bountyId !== undefined && bounty && Array.isArray(bounty) && (bounty[1] as string) !== "" && (
                                <div className="mt-4 p-4 border rounded-lg bg-secondary/50 space-y-2">
                                     <div className="flex justify-between items-center">
                                         <p className="text-sm font-bold">Bounty #{bountyId.toString()}</p>
                                        <Badge variant={bounty[3] ? "default" : "destructive"}>{bounty[3] ? "Open" : "Closed"}</Badge>
                                    </div>
                                    <p className="text-sm font-mono break-all"><b>Poster:</b> {bounty[0] as string}</p>
                                    <p className="text-sm font-mono"><b>Amount:</b> {formatEther(bounty[2] as bigint)} ETH</p>
                                    <p className="text-sm font-mono"><b>Description:</b></p>
                                    <p className="text-sm font-mono bg-background/50 p-2 rounded-md break-words">{bounty[1] as string}</p>
                                     {bounty[4] && (bounty[4] as string) !== '0x0000000000000000000000000000000000000000' && (
                                        <>
                                            <p className="text-sm font-mono break-all"><b>Solver:</b> {bounty[4] as string}</p>
                                            <p className="text-sm font-mono"><b>Proof:</b></p>
                                            <p className="text-sm font-mono bg-background/50 p-2 rounded-md break-words">{bounty[5] as string}</p>
                                        </>
                                    )}
                                </div>
                            )}
                             {bountyId !== undefined && bounty && Array.isArray(bounty) && (bounty[1] as string) === "" && (
                                <div className="mt-4 p-4 border rounded-lg bg-secondary/50 space-y-2">
                                    <p className="text-sm text-muted-foreground">Bounty with ID {bountyId.toString()} not found.</p>
                                </div>
                             )}
                        </ContractCard>
                    </div>
                </div>
            </div>
        </div>
    )
}
