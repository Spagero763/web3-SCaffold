import { PageHeader } from "@/components/page-header";
import { Bot } from "lucide-react";
import { AIGeneratorForm } from "./_components/ai-generator-form";

export default function AIGeneratorPage() {
    return (
        <div>
            <PageHeader
                title="AI Component Generator"
                description="Paste a smart contract ABI and name below to automatically generate React components for interacting with it."
                icon={Bot}
            />
            <div className="p-4 md:p-6 lg:p-8">
                <AIGeneratorForm />
            </div>
        </div>
    )
}
