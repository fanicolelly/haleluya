import { Bot, Sparkles } from "lucide-react";

export default function BotMascot() {
  return (
    <div className="relative hidden h-52 w-52 shrink-0 items-center justify-center lg:flex">
      <div className="absolute inset-0 rounded-full bg-brand-soft" />
      <div className="absolute -top-2 right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
        <Sparkles size={18} className="text-amber-400" />
      </div>
      <Bot size={92} strokeWidth={1.5} className="relative text-brand" />
    </div>
  );
}
