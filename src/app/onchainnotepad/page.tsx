
'use client';
import { PageHeader } from "@/components/page-header";
import { contracts } from "@/contracts/definitions";
import { ContractCard } from "@/components/contract/contract-card";
import { FunctionForm } from "@/components/contract/function-form";
import { ReadFunction } from "@/components/contract/read-function";
import { EventLogs } from "@/components/contract/event-logs";
import { Eye, History, Pencil, Hash, Info, NotebookPen } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useReadContract } from "wagmi";

const idSchema = z.object({
    id: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, { message: "ID must be a positive number." }),
});


export default function OnchainNotepadPage() {
    const contract = contracts.onchainNotepad;
    const [noteId, setNoteId] = useState<bigint | undefined>();

    const idForm = useForm<z.infer<typeof idSchema>>({
        resolver: zodResolver(idSchema),
        defaultValues: { id: "" },
    });

    const { data: note, refetch: refetchNote } = useReadContract({
        abi: contract.abi,
        address: contract.address,
        functionName: 'get',
        args: [noteId],
        query: { enabled: noteId !== undefined }
    });

    const onIdSubmit = (values: z.infer<typeof idSchema>) => {
        setNoteId(BigInt(values.id));
        refetchNote();
    };

    const writeFunctions = contract.abi.filter(item => item.type === 'function' && (item.stateMutability === 'nonpayable' || item.stateMutability === 'payable'));
    const events = contract.abi.filter(item => item.type === 'event');
    const nextIdAbi = contract.abi.find(item => item.name === 'nextId');
    
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
                        {nextIdAbi && (
                             <ContractCard title="Total Notes" description="Total number of notes saved." icon={NotebookPen}>
                                <ReadFunction abiItem={nextIdAbi} contractAddress={contract.address} />
                           </ContractCard>
                        )}

                        <ContractCard title="Get Note" description="Fetch a specific note by its ID." icon={Info}>
                            <Form {...idForm}>
                                <form onSubmit={idForm.handleSubmit(onIdSubmit)} className="space-y-4">
                                    <FormField
                                        control={idForm.control}
                                        name="id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Note ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" {...field} type="number" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Get Note</Button>
                                </form>
                            </Form>
                            {noteId !== undefined && note && Array.isArray(note) && (note[1] as string) !== "" && (
                                <div className="mt-4 p-4 border rounded-lg bg-secondary/50 space-y-2">
                                    <p className="text-sm font-mono break-all"><b>Author:</b> {note[0] as string}</p>
                                    <p className="text-sm font-mono"><b>Timestamp:</b> {new Date(Number(note[2]) * 1000).toLocaleString()}</p>
                                    <p className="text-sm font-mono"><b>Note:</b></p>
                                    <p className="text-sm font-mono bg-background/50 p-2 rounded-md break-words">{note[1] as string}</p>
                                </div>
                            )}
                             {noteId !== undefined && note && Array.isArray(note) && (note[1] as string) === "" && (
                                <div className="mt-4 p-4 border rounded-lg bg-secondary/50 space-y-2">
                                    <p className="text-sm text-muted-foreground">Note with ID {noteId.toString()} not found.</p>
                                </div>
                             )}
                        </ContractCard>
                    </div>
                </div>
            </div>
        </div>
    )
}
