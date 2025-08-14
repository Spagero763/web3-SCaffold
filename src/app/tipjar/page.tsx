
'use client';
import { PageHeader } from "@/components/page-header";
import { contracts } from "@/contracts/definitions";
import { ContractCard } from "@/components/contract/contract-card";
import { FunctionForm } from "@/components/contract/function-form";
import { EventLogs } from "@/components/contract/event-logs";
import { History, Pencil, Wallet } from "lucide-react";
import { useBalance } from "wagmi";
import { formatEther } from "viem";
import { Skeleton } from "@/components/ui/skeleton";

export default function TipJarPage() {
    const contract = contracts.tipJar;

    const { data: balance, isLoading } = useBalance({
        address: contract.address,
    });

    const writeFunctions = contract.abi.filter(item => item.type === 'function' && (item.stateMutability === 'nonpayable' || item.stateMutability === 'payable'));
    const events = contract.abi.filter(item => item.type === 'event');
    
    return (
        <div>
            <PageHeader title={contract.name} description={contract.description} icon={contract.icon} />
            <div className="grid gap-6 p-4 md:p-6 lg:p-8">

                <ContractCard title="Contract Balance" description="The total amount of ETH held by this contract." icon={Wallet}>
                    {isLoading ? (
                        <Skeleton className="h-8 w-1/2" />
                    ) : (
                        <div className="text-2xl font-bold">
                            {balance ? `${formatEther(balance.value)} ETH` : '0 ETH'}
                        </div>
                    )}
                </ContractCard>

                <div className="grid gap-6 lg:grid-cols-2">
                    {writeFunctions.length > 0 && (
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
                        </div>
                    )}

                    <div className="space-y-6">
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
