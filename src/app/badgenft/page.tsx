import { PageHeader } from "@/components/page-header";
import { contracts } from "@/contracts/definitions";
import { ContractCard } from "@/components/contract/contract-card";
import { FunctionForm } from "@/components/contract/function-form";
import { ReadFunction } from "@/components/contract/read-function";
import { EventLogs } from "@/components/contract/event-logs";
import { Eye, History, Pencil } from "lucide-react";

export default function BadgeNFTPage() {
    const contract = contracts.badgeNft;

    const readFunctions = contract.abi.filter(item => item.type === 'function' && item.stateMutability === 'view');
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
                        {readFunctions.length > 0 && (
                           <ContractCard title="Read Functions" description="Query data from the contract." icon={Eye}>
                               <div className="space-y-4">
                                   {readFunctions.map(item => (
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
