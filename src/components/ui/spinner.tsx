import { cn } from "@/lib/utils";

export function Spinner({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("border-border size-6 animate-spin rounded-full border-4 border-t-blue-600", className)}
			{...props}
		/>
	);
}
