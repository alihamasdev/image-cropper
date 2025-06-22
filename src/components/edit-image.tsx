"use client";

import { Fragment, useCallback, useEffect, useRef, useState, useTransition } from "react";

import { aspectRatioList, getCroppedImg, type Area } from "@/lib/helpers";
import { type FileMetadata } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from "@/components/ui/cropper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FinalResult } from "@/components/final-result";

export function EditImage({
	preview,
	file,
	...props
}: React.ComponentProps<typeof Card> & { preview: string; file: File | FileMetadata }) {
	const [croppedFile, setCroppedFile] = useState<File | null>(null);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [aspectRatio, setAspectRatio] = useState<number>(1 / 1);
	const [outputWidth, setOutputWidth] = useState<number | null>(null);
	const [outputHeight, setOutputHeight] = useState<number | null>(null);

	const finalResultRef = useRef<HTMLDivElement>(null);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		if (!isPending && croppedFile && finalResultRef.current) {
			finalResultRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [croppedFile, isPending]);

	useEffect(() => {
		setCroppedFile(null);
	}, [outputWidth, outputHeight, aspectRatio]);

	useEffect(() => {
		setCroppedFile(null);
	}, [croppedAreaPixels]);

	const handleCropChange = useCallback((pixels: Area | null) => {
		setCroppedAreaPixels(pixels);
	}, []);

	const handleAspectRatioChange = (value: number) => {
		setAspectRatio(value);
		if (outputWidth) {
			setOutputHeight(Math.round(outputWidth / value));
		}
	};

	const handleOutputSizeChange = (value: number, valueFor: "width" | "height") => {
		if (valueFor === "width") {
			setOutputWidth(value);
			setOutputHeight(Math.round(value / aspectRatio));
		} else {
			setOutputHeight(value);
			setOutputWidth(Math.round(value * aspectRatio));
		}
	};

	const handleCrop = () => {
		startTransition(async () => {
			if (!croppedAreaPixels) return;

			const croppedBlob = await getCroppedImg(
				preview,
				croppedAreaPixels,
				outputWidth || croppedAreaPixels.width,
				outputHeight || croppedAreaPixels.height
			);
			if (!croppedBlob) return;

			const cropFile = new File([croppedBlob], file.name, { type: file.type });
			setCroppedFile(cropFile);
		});
	};

	return (
		<Fragment>
			<Card className="relative h-[95dvh] overflow-hidden rounded-xl border" {...props}>
				<Cropper
					className="h-full"
					aspectRatio={Number(aspectRatio)}
					image={preview}
					maxZoom={10}
					onCropChange={handleCropChange}
				>
					<CropperImage />
					<CropperCropArea />
					<CropperDescription />
				</Cropper>
				<CardFooter className="grid grid-cols-1 gap-x-6 gap-y-4 p-4 md:grid-cols-2 lg:grid-cols-4">
					<div className="space-y-2">
						<Label htmlFor="aspect-ratio">Aspect Ratio</Label>
						<Select
							defaultValue={`${aspectRatio}`}
							onValueChange={(value) => handleAspectRatioChange(Number(value))}
							disabled={isPending}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{aspectRatioList.map(({ label, value }) => (
									<SelectItem key={value} value={`${value}`}>
										{label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="width">Output Width</Label>
						<Input
							name="width"
							id="width"
							type="number"
							placeholder="Auto"
							disabled={isPending}
							value={outputWidth || undefined}
							onChange={(e) => handleOutputSizeChange(Number(e.target.value), "width")}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="height">Output Height</Label>
						<Input
							name="height"
							id="height"
							type="number"
							placeholder="Auto"
							disabled={isPending}
							value={outputHeight || undefined}
							onChange={(e) => handleOutputSizeChange(Number(e.target.value), "height")}
						/>
					</div>
					<Button className="mt-auto" onClick={handleCrop} disabled={isPending || !croppedAreaPixels}>
						{isPending ? "Cropping..." : "Crop Image"}
					</Button>
				</CardFooter>
			</Card>

			{croppedFile && (
				<FinalResult
					ref={finalResultRef}
					croppedFile={croppedFile}
					outputWidth={outputWidth || croppedAreaPixels?.width}
					outputHeight={outputHeight || croppedAreaPixels?.height}
				/>
			)}
		</Fragment>
	);
}
