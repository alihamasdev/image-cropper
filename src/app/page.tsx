import { Crop } from "@/components/crop";
import { ThemeToggle } from "@/components/theme-button";

export default function HomePage() {
	return (
		<main className="relative container mx-auto min-h-dvh w-full px-5 pt-10 pb-30">
			<header className="flex w-full items-center justify-between">
				<h1 className="text-center text-4xl font-bold tracking-tight text-balance">Image Cropper</h1>
				<ThemeToggle />
			</header>
			<div className="mt-12 w-full">
				<Crop />
			</div>
		</main>
	);
}
