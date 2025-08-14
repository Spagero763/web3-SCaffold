"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther } from "viem"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle } from "lucide-react"
import { Textarea } from "../ui/textarea"
import { Checkbox } from "../ui/checkbox"

type FunctionFormProps = {
    abiItem: any;
    contractAddress: `0x${string}`;
}

export function FunctionForm({ abiItem, contractAddress }: FunctionFormProps) {
    const { toast } = useToast()
    const { data: hash, error: writeError, isPending: isWritePending, writeContract } = useWriteContract()

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

    const formSchema = z.object(
        abiItem.inputs.reduce((acc: any, input: any) => {
            if (input.type.includes('[]')) {
                 acc[input.name] = z.string().min(1, `Please provide a comma-separated list for ${input.name}`);
            } else if (input.type.startsWith('uint') || input.type.startsWith('int')) {
                acc[input.name] = z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, { message: "Must be a positive number" });
            } else if (input.type === 'bool') {
                 acc[input.name] = z.boolean().default(false);
            }
             else {
                acc[input.name] = z.string().min(1, `${input.name} is required.`);
            }
            return acc;
        }, {})
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: abiItem.inputs.reduce((acc: any, input: any) => {
             if (input.type === 'bool') {
                acc[input.name] = false;
            } else {
                acc[input.name] = "";
            }
            return acc;
        }, {}),
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        const args = abiItem.inputs.map((input: any) => {
            let value = values[input.name];
            if(input.type.includes('[]')) {
                return value.split(',').map((s: string) => s.trim());
            }
            return value;
        });

        let txValue;
        if (abiItem.stateMutability === 'payable') {
            const valueInput = values['value'];
            txValue = valueInput ? parseEther(valueInput) : BigInt(0);
        }

        writeContract({
            address: contractAddress,
            abi: [abiItem],
            functionName: abiItem.name,
            args,
            ...(txValue !== undefined && { value: txValue }),
        }, {
            onSuccess: () => {
                 toast({
                    title: "Transaction Sent",
                    description: "Waiting for confirmation...",
                });
            },
            onError: (err) => {
                toast({
                    title: "Transaction Error",
                    description: err.message,
                    variant: "destructive",
                });
            }
        });
    }

    React.useEffect(() => {
        if(isConfirmed) {
            toast({
                title: "Transaction Confirmed",
                description: "Your transaction has been confirmed.",
            });
            form.reset();
        }
    }, [isConfirmed, toast, form])

    React.useEffect(() => {
        if(writeError) {
             toast({
                title: "Submission Error",
                description: writeError.message,
                variant: "destructive",
            });
        }
    }, [writeError, toast])


    const allInputs = [...abiItem.inputs];
    if (abiItem.stateMutability === 'payable') {
        allInputs.push({ name: 'value', type: 'ether', description: 'Amount of ETH to send with the transaction.' });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {allInputs.map((input: any) => (
                    <FormField
                        key={input.name}
                        control={form.control}
                        name={input.name}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="capitalize font-mono">{input.name} <span className="text-muted-foreground font-sans">({input.type})</span></FormLabel>
                                <FormControl>
                                    {input.type.includes('[]') ? (
                                        <Textarea placeholder={`Comma-separated list, e.g., val1,val2,val3`} {...field} />
                                    ) : input.type === 'bool' ? (
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <label
                                                htmlFor={input.name}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {input.name}
                                            </label>
                                        </div>
                                    ) : (
                                        <Input 
                                            placeholder={input.type === 'ether' ? 'e.g., 0.1' : `Enter ${input.name}`} 
                                            {...field} 
                                            type={input.type.startsWith('uint') || input.type.startsWith('int') || input.type === 'ether' ? 'number' : 'text'}
                                            step="any"
                                        />
                                    )}
                                </FormControl>
                                {input.description && <FormDescription>{input.description}</FormDescription>}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                <Button type="submit" disabled={isWritePending || isConfirming} className="w-full">
                    {(isWritePending || isConfirming) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isConfirming ? 'Confirming...' : isConfirmed ? 'Confirmed' : isWritePending ? 'Sending...' : 'Submit'}
                </Button>
                 {hash && (
                    <div className="text-sm text-muted-foreground break-all">
                        Transaction Hash: {hash}
                    </div>
                )}
            </form>
        </Form>
    )
}
