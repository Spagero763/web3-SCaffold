"use client";
import { AppKit, AppKitProvider } from "@reown/appkit";
import { wagmiAdapter } from "@reown/appkit-adapter-wagmi";
import "@reown/appkit/dist/index.css";
import { config } from "@/lib/wagmi";

export default function ReownApp() {
  return (
    <AppKitProvider
      adapter={wagmiAdapter(config as any)}
      config={{
        mainnet: {
          token: "some_token",
        },
      }}
    >
      <AppKit />
    </AppKitProvider>
  );
}