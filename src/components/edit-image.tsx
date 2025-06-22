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

export function EditImage({ preview, file }: { preview: string; file: File | FileMetadata }) {
	const [croppedFile, setCroppedFile] = useState<File | null>(null);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [aspectRatio, setAspectRatio] = useState<number>(1 / 1);
	const [outputSize, setOutputSize] = useState<{ width: number; height: number } | null>(null);

	const finalResultRef = useRef<HTMLDivElement>(null);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		if (!isPending && croppedFile && finalResultRef.current) {
			finalResultRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [croppedFile, isPending]);

	const handleCropChange = useCallback((pixels: Area | null) => {
		setCroppedAreaPixels(pixels);
	}, []);

	const handleAspectRatioChange = (value: number) => {
		setCroppedFile(null);
		setAspectRatio(value);
		setOutputSize((prev) => (prev ? { width: prev.width, height: Math.round(prev.width / value) } : null));
	};

	const handleOutputSizeChange = (value: number, valueFor: "width" | "height") => {
		setCroppedFile(null);
		if (valueFor === "width") {
			setOutputSize({ width: value, height: Math.round(value / aspectRatio) });
		} else {
			setOutputSize({ height: value, width: Math.round(value * aspectRatio) });
		}
		// if (value < 1) {
		// 	setOutputSize(undefined);
		// }
	};

	const handleCrop = () => {
		startTransition(async () => {
			if (!croppedAreaPixels) return;

			const croppedBlob = await getCroppedImg(
				preview,
				croppedAreaPixels,
				outputSize?.width || croppedAreaPixels.width,
				outputSize?.height || croppedAreaPixels.height
			);
			if (!croppedBlob) return;

			const cropFile = new File([croppedBlob], file.name, { type: file.type });
			setCroppedFile(cropFile);
		});
	};

	return (
		<Fragment>
			<Card className="relative h-[65dvh] overflow-hidden rounded-xl border">
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
						<Label>Aspect Ratio</Label>
						<Select defaultValue={`${aspectRatio}`} onValueChange={(value) => handleAspectRatioChange(Number(value))}>
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
						<Label>Output Width</Label>
						<Input
							name="width"
							type="number"
							placeholder="Auto"
							value={outputSize?.width}
							onChange={(e) => handleOutputSizeChange(Number(e.target.value), "width")}
						/>
					</div>
					<div className="space-y-2">
						<Label>Output Height</Label>
						<Input
							name="height"
							type="number"
							placeholder="Auto"
							value={outputSize?.height}
							onChange={(e) => handleOutputSizeChange(Number(e.target.value), "height")}
						/>
					</div>
					<Button className="mt-auto" onClick={handleCrop} disabled={isPending || !croppedAreaPixels}>
						Crop Image
					</Button>
				</CardFooter>
			</Card>

			{!isPending && croppedFile && (
				<FinalResult
					croppedFile={croppedFile}
					outputWidth={outputSize?.width || croppedAreaPixels?.width}
					outputHeight={outputSize?.height || croppedAreaPixels?.height}
					ref={finalResultRef}
				/>
			)}
		</Fragment>
	);
}
