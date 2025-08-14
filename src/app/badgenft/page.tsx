
'use client';
import { PageHeader } from "@/components/page-header";
import { contracts } from "@/contracts/definitions";
import { ContractCard } from "@/components/contract/contract-card";
import { FunctionForm } from "@/components/contract/function-form";
import { ReadFunction } from "@/components/contract/read-function";
import { EventLogs } from "@/components/contract/event-logs";
import { Eye, History, Pencil, User, Hash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useReadContract } from "wagmi";

const addressSchema = z.object({
    address: z.string().startsWith('0x', "Address must start with 0x."),
});

const tokenIdSchema = z.object({
    tokenId: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, { message: "Token ID must be a positive number." }),
});

export default function BadgeNFTPage() {
    const contract = contracts.badgeNft;

    const [balanceOfAddress, setBalanceOfAddress] = useState<`0x${string}` | undefined>();
    const [ownerOfTokenId, setOwnerOfTokenId] = useState<bigint | undefined>();

    const balanceOfForm = useForm<z.infer<typeof addressSchema>>({
        resolver: zodResolver(addressSchema),
        defaultValues: { address: "" },
    });

    const ownerOfForm = useForm<z.infer<typeof tokenIdSchema>>({
        resolver: zodResolver(tokenIdSchema),
        defaultValues: { tokenId: "" },
    });

    const { data: balance, refetch: refetchBalance } = useReadContract({
        abi: contract.abi,
        address: contract.address,
        functionName: 'balanceOf',
        args: [balanceOfAddress],
        query: { enabled: !!balanceOfAddress }
    });
    
    const { data: owner, refetch: refetchOwner } = useReadContract({
        abi: contract.abi,
        address: contract.address,
        functionName: 'ownerOf',
        args: [ownerOfTokenId],
        query: { enabled: ownerOfTokenId !== undefined }
    });

    const onBalanceOfSubmit = (values: z.infer<typeof addressSchema>) => {
        setBalanceOfAddress(values.address as `0x${string}`);
        refetchBalance();
    };

    const onOwnerOfSubmit = (values: z.infer<typeof tokenIdSchema>) => {
        setOwnerOfTokenId(BigInt(values.tokenId));
        refetchOwner();
    };

    const otherReadFunctions = contract.abi.filter(item => item.type === 'function' && item.stateMutability === 'view' && !['balanceOf', 'ownerOf'].includes(item.name) && item.inputs.length === 0);
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
                    </div>

                    <div className="space-y-6">
                        <ContractCard title="Check Balance" description="Check the NFT balance of an address." icon={User}>
                            <Form {...balanceOfForm}>
                                <form onSubmit={balanceOfForm.handleSubmit(onBalanceOfSubmit)} className="space-y-4">
                                    <FormField
                                        control={balanceOfForm.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0x..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Query Balance</Button>
                                </form>
                            </Form>
                            {balanceOfAddress && balance !== undefined && (
                                 <div className="mt-4 p-4 border rounded-lg bg-secondary/50">
                                    <p className="text-sm font-mono">Balance: {balance.toString()}</p>
                                 </div>
                            )}
                        </ContractCard>

                        <ContractCard title="Find Owner" description="Find the owner of a specific Token ID." icon={Hash}>
                            <Form {...ownerOfForm}>
                                <form onSubmit={ownerOfForm.handleSubmit(onOwnerOfSubmit)} className="space-y-4">
                                    <FormField
                                        control={ownerOfForm.control}
                                        name="tokenId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Token ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" {...field} type="number" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Find Owner</Button>
                                </form>
                            </Form>
                            {ownerOfTokenId !== undefined && owner && (
                                <div className="mt-4 p-4 border rounded-lg bg-secondary/50">
                                    <p className="text-sm font-mono break-all">Owner: {owner.toString()}</p>
                                </div>
                            )}
                        </ContractCard>

                       {otherReadFunctions.length > 0 && (
                           <ContractCard title="Other Read Functions" description="Query data from the contract." icon={Eye}>
                               <div className="space-y-4">
                                   {otherReadFunctions.map(item => (
                                       <div key={item.name}>
                                            <h4 className="font-medium font-mono text-sm mb-1">{item.name}</h4>
                                            <ReadFunction abiItem={item} contractAddress={contract.address} />
                                       </div>
                                   ))}
                               </div>
                           </ContractCard>
                       )}
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
                </div>
            </div>
        </div>
    )
}
