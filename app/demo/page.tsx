import { DemoApp } from "@/components/DemoApp";

export const metadata = {
  title: "Demo — ExecutionVault",
  description: "Interactive demo of the ExecutionVault dead-letter queue and execution inspector.",
};

export default function DemoPage() {
  return <DemoApp />;
}
