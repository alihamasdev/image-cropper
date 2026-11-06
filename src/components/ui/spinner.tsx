import { cn } from "cn";

export function Spinner({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("size-6 animate-spin rounded-full border-4 border-border border-t-blue-600", className)} {...props} />;
}
