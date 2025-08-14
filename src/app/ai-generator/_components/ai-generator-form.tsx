"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateUIComponents } from "@/ai/flows/generate-ui-components";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  contractName: z.string().min(1, "Contract name is required."),
  abi: z.string().min(10, "ABI is required.").refine(val => {
      try {
          JSON.parse(val);
          return true;
      } catch (e) {
          return false;
      }
  }, { message: "Invalid JSON format for ABI."}),
});

export function AIGeneratorForm() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [generatedCode, setGeneratedCode] = useState("");
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            contractName: "Donation Tracker",
            abi: '[{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"causeId","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":true,"internalType":"address","name":"beneficiary","type":"address"}],"name":"CauseRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"causeId","type":"uint256"},{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Donated","type":"event"},{"inputs":[],"name":"causeCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"causes","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address payable","name":"beneficiary","type":"address"},{"internalType":"uint256","name":"totalReceived","type":"uint256"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"causeId","type":"uint256"}],"name":"donate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"address payable","name":"beneficiary","type":"address"}],"name":"registerCause","outputs":[{"internalType":"uint256","name":"id","type":"uint256"}],"stateMutability":"nonpayable","type":"function"}]',
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setGeneratedCode("");
        try {
            const result = await generateUIComponents(values);
            setGeneratedCode(result.components);
        } catch (error) {
            console.error(error);
            toast({
                title: "Generation Failed",
                description: "An error occurred while generating components.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    function copyToClipboard() {
        navigator.clipboard.writeText(generatedCode);
        toast({
            title: "Copied to Clipboard",
            description: "The generated code has been copied.",
        });
    }

    return (
        <div className="grid gap-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle>Contract Details</CardTitle>
                    <CardDescription>Provide the contract name and its JSON ABI.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="contractName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contract Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., MyAwesomeContract" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="abi"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contract ABI</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder='[{"inputs":[],"name":"myFunction",...}]' {...field} className="h-64 font-code" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-4 w-4" />
                                        Generate Components
                                    </>
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Generated Code</CardTitle>
                    <CardDescription>Your React components will appear here.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                    <div className="relative flex-grow">
                        <ScrollArea className="absolute inset-0">
                            <pre className="p-4 rounded-md bg-muted text-muted-foreground text-sm font-code">
                                <Textarea readOnly value={generatedCode || "..."} className="w-full h-full bg-transparent border-0 focus:ring-0" />
                            </pre>
                        </ScrollArea>
                        {generatedCode && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2"
                                onClick={copyToClipboard}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
