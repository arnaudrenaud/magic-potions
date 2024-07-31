import { Loader2 } from "lucide-react";

export function PageLoading() {
  return (
    <div className="w-full h-dvh flex justify-center items-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}
