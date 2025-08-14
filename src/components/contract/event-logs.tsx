"use client"

import { useState, useEffect } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type EventLogsProps = {
  abi: any;
  contractAddress: `0x${string}`;
  eventName: string;
};

export function EventLogs({ abi, contractAddress, eventName }: EventLogsProps) {
  const [logs, setLogs] = useState<any[]>([]);

  useWatchContractEvent({
    address: contractAddress,
    abi,
    eventName,
    onLogs(newLogs) {
      setLogs((prevLogs) => [...newLogs.slice(-10), ...prevLogs].slice(0, 20));
    },
    onError(error) {
      console.error('Error watching event:', error);
    },
  });

  return (
    <div className="space-y-4">
        <h4 className="font-medium">Live Event Logs: <Badge variant="secondary">{eventName}</Badge></h4>
        <ScrollArea className="h-48 w-full rounded-md border p-4 font-mono text-sm">
        {logs.length === 0 ? (
            <p className="text-muted-foreground">Listening for events...</p>
        ) : (
            logs.map((log, i) => (
            <div key={log.transactionHash + i}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {Object.entries(log.args).map(([key, value]) => (
                        <div key={key} className="break-all">
                            <span className="text-muted-foreground">{key}: </span>
                            <span>{String(value)}</span>
                        </div>
                    ))}
                </div>
                {i < logs.length -1 && <Separator className="my-2" />}
            </div>
            ))
        )}
        </ScrollArea>
    </div>
  );
}
