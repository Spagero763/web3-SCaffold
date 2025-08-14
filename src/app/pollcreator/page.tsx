
'use client';
import { PageHeader } from "@/components/page-header";
import { contracts } from "@/contracts/definitions";
import { ContractCard } from "@/components/contract/contract-card";
import { FunctionForm } from "@/components/contract/function-form";
import { ReadFunction } from "@/components/contract/read-function";
import { EventLogs } from "@/components/contract/event-logs";
import { Eye, History, Pencil, Info, BarChart } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useReadContract, useAccount } from "wagmi";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const idSchema = z.object({
    id: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, { message: "ID must be a positive number." }),
});

export default function PollCreatorPage() {
    const contract = contracts.pollCreator;
    const { address: account } = useAccount();

    const [pollId, setPollId] = useState<bigint | undefined>();
    const [totalVotes, setTotalVotes] = useState(0);

    const idForm = useForm<z.infer<typeof idSchema>>({
        resolver: zodResolver(idSchema),
        defaultValues: { id: "" },
    });

    const { data: poll, refetch: refetchPoll, isFetching: isFetchingPoll } = useReadContract({
        abi: contract.abi,
        address: contract.address,
        functionName: 'getPoll',
        args: [pollId],
        query: { enabled: pollId !== undefined }
    });
    
    const { data: pollCount, isFetching: isFetchingPollCount } = useReadContract({
        abi: contract.abi,
        address: contract.address,
        functionName: 'pollCount',
    });

    const onIdSubmit = (values: z.infer<typeof idSchema>) => {
        setPollId(BigInt(values.id));
        refetchPoll();
    };

    const writeFunctions = contract.abi.filter(item => item.type === 'function' && (item.stateMutability === 'nonpayable' || item.stateMutability === 'payable'));
    const events = contract.abi.filter(item => item.type === 'event');

    const pollQuestion = poll && Array.isArray(poll) ? poll[0] : null;
    const pollOptions = poll && Array.isArray(poll) ? poll[1] : [];
    const isPollOpen = poll && Array.isArray(poll) ? poll[2] : false;

    useEffect(() => {
        if (pollOptions && pollOptions.length > 0) {
            setTotalVotes(0); // Reset on new poll
        }
    }, [pollOptions]);

    return (
        <div>
            <PageHeader title={contract.name} description={contract.description} icon={contract.icon} />
            <div className="grid gap-6 p-4 md:p-6 lg:p-8">
                <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-6">
                        {writeFunctions.map(item => (
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
                         <ContractCard title="Total Polls" description="Total number of polls created." icon={BarChart}>
                            {isFetchingPollCount ? <ReadFunction abiItem={{name: 'pollCount', outputs: [{type: 'uint256'}]}} contractAddress={contract.address} /> : <div className="text-2xl font-bold">{pollCount?.toString()}</div>}
                         </ContractCard>

                        <ContractCard title="View Poll" description="Fetch a poll by its ID to see details and vote counts." icon={Info}>
                            <Form {...idForm}>
                                <form onSubmit={idForm.handleSubmit(onIdSubmit)} className="space-y-4">
                                    <FormField
                                        control={idForm.control}
                                        name="id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Poll ID</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="0" {...field} type="number" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" disabled={isFetchingPoll}>
                                        {isFetchingPoll ? "Fetching..." : "Get Poll"}
                                    </Button>
                                </form>
                            </Form>
                            
                            {pollId !== undefined && !isFetchingPoll && pollQuestion && (
                                <div className="mt-4 p-4 border rounded-lg bg-secondary/50 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-bold text-lg">{pollQuestion}</h3>
                                        <Badge variant={isPollOpen ? "default" : "destructive"}>{isPollOpen ? "Open" : "Closed"}</Badge>
                                    </div>
                                    <div className="space-y-3">
                                        {pollOptions.map((option: string, index: number) => (
                                            <PollOption 
                                                key={index}
                                                pollId={pollId}
                                                optionIndex={BigInt(index)}
                                                optionText={option}
                                                onNewVote={() => setTotalVotes(prev => prev + 1)}
                                                totalVotes={totalVotes}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                             {pollId !== undefined && !isFetchingPoll && !pollQuestion && (
                                <div className="mt-4 p-4 border rounded-lg bg-secondary/50 space-y-2">
                                    <p className="text-sm text-muted-foreground">Poll with ID {pollId.toString()} not found.</p>
                                </div>
                             )}
                        </ContractCard>
                    </div>
                </div>
            </div>
        </div>
    )
}

type PollOptionProps = {
    pollId: bigint;
    optionIndex: bigint;
    optionText: string;
    totalVotes: number;
    onNewVote: () => void;
};

function PollOption({ pollId, optionIndex, optionText, totalVotes, onNewVote }: PollOptionProps) {
    const {data: votes, refetch} = useReadContract({
        abi: contracts.pollCreator.abi,
        address: contracts.pollCreator.address,
        functionName: 'getVotes',
        args: [pollId, optionIndex]
    });

    useEffect(() => {
        const interval = setInterval(() => {
            refetch();
        }, 5000); // Poll for new votes every 5 seconds
        return () => clearInterval(interval);
    }, [refetch]);

    const voteCount = Number(votes);
    const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
    
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <p className="font-medium">{optionText}</p>
                <p className="text-muted-foreground">{voteCount} vote(s)</p>
            </div>
            <Progress value={percentage} className="h-2" />
        </div>
    )
}
