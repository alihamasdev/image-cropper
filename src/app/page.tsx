import { Crop } from "@/components/crop";

export default function HomePage() {
	return (
		<main className="container mx-auto min-h-dvh w-full px-5 pt-10 pb-30">
			<h1 className="mb-12 text-center text-4xl font-bold">Image Cropper</h1>
			<Crop />
		</main>
	);
}
