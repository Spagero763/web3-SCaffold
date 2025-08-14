
'use client';
import { PageHeader } from "@/components/page-header";
import { contracts } from "@/contracts/definitions";
import { ContractCard } from "@/components/contract/contract-card";
import { FunctionForm } from "@/components/contract/function-form";
import { ReadFunction } from "@/components/contract/read-function";
import { Eye, Pencil, Hash, Box, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useReadContract } from "wagmi";
import { formatEther } from "viem";

const tokenIdSchema = z.object({
    id: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, { message: "ID must be a positive number." }),
});

export default function TimeCapsulePage() {
    const contract = contracts.timeCapsule;

    const [capsuleId, setCapsuleId] = useState<bigint | undefined>();

    const idForm = useForm<z.infer<typeof tokenIdSchema>>({
        resolver: zodResolver(tokenIdSchema),
        defaultValues: { id: "" },
    });
    
    const { data: capsule, refetch: refetchCapsule } = useReadContract({
        abi: contract.abi,
        address: contract.address,
        functionName: 'capsules',
        args: [capsuleId],
        query: { enabled: capsuleId !== undefined }
    });

    const onIdSubmit = (values: z.infer<typeof tokenIdSchema>) => {
        setCapsuleId(BigInt(values.id));
        refetchCapsule();
    };

    const capsuleCountAbi = contract.abi.find(item => item.name === 'capsuleCount');
    const writeFunctions = contract.abi.filter(item => item.type === 'function' && (item.stateMutability === 'nonpayable' || item.stateMutability === 'payable'));
    
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
                        {capsuleCountAbi && (
                             <ContractCard title="Total Capsules" description="Total number of time capsules created." icon={Box}>
                                <ReadFunction abiItem={capsuleCountAbi} contractAddress={contract.address} />
                           </ContractCard>
                        )}

                        <ContractCard title="View Capsule" description="View the details of a specific time capsule." icon={Info}>
                            <Form {...idForm}>
                                <form onSubmit={idForm.handleSubmit(onIdSubmit)} className="space-y-4">
                                    <FormField
                                        control={idForm.control}
                                        name="id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Capsule ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" {...field} type="number" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">View Details</Button>
                                </form>
                            </Form>
                            {capsuleId !== undefined && capsule && Array.isArray(capsule) && (
                                <div className="mt-4 p-4 border rounded-lg bg-secondary/50 space-y-2">
                                    <p className="text-sm font-mono break-all">Owner: {(capsule[0] as string)}</p>
                                    <p className="text-sm font-mono">Unlock Time: {new Date(Number(capsule[1]) * 1000).toLocaleString()}</p>
                                    <p className="text-sm font-mono">Amount: {formatEther(capsule[2] as bigint)} ETH</p>
                                </div>
                            )}
                        </ContractCard>
                    </div>
                </div>
            </div>
        </div>
    )
}
