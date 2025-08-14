"use client"

import { useReadContract } from "wagmi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "../ui/badge";

type ReadFunctionProps = {
    abiItem: any;
    contractAddress: `0x${string}`;
}

export function ReadFunction({ abiItem, contractAddress }: ReadFunctionProps) {
    const { data, isError, isLoading, error } = useReadContract({
        address: contractAddress,
        abi: [abiItem],
        functionName: abiItem.name,
    });

    const renderData = (data: any) => {
        if (data === null || data === undefined) return "N/A";
        if (typeof data === 'bigint') return data.toString();
        if (typeof data === 'boolean') return data ? "True" : "False";
        if (Array.isArray(data)) return `[${data.join(', ')}]`;
        if (typeof data === 'object') return JSON.stringify(data, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value, 2
        );
        return String(data);
    };

    return (
        <div className="p-4 border rounded-lg bg-secondary/50">
            {isLoading && <Skeleton className="h-8 w-full" />}
            {isError && (
                 <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="break-words">
                        {error?.shortMessage || "Failed to fetch data."}
                    </AlertDescription>
                </Alert>
            )}
            {!isLoading && !isError && (
                <div className="flex items-center justify-between">
                    <pre className="text-sm font-mono bg-transparent p-0 overflow-x-auto">
                        <code>{renderData(data)}</code>
                    </pre>
                    <Badge variant="outline">{abiItem.outputs[0]?.type || 'value'}</Badge>
                </div>
            )}
        </div>
    );
}
