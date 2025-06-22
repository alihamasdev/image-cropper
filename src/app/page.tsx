import { Crop } from "@/components/crop";
import { ThemeToggle } from "@/components/theme-button";

export default function HomePage() {
	return (
		<main className="flex min-h-dvh w-full flex-col">
			<header className="container mx-auto flex w-full items-center justify-between px-4 py-10">
				<h1 className="text-left text-2xl font-bold md:text-3xl lg:text-4xl">Image Cropper</h1>
				<ThemeToggle />
			</header>

			<div className="container mx-auto mb-10 w-full space-y-10 px-4">
				<Crop />
			</div>

			<footer className="mt-auto border-t py-8">
				<div className="container mx-auto flex items-center justify-between px-4">
					<p className="text-muted-foreground text-sm">&#169; 2025 Ali Hamas, Inc.</p>
				</div>
			</footer>
		</main>
	);
}
