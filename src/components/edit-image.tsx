"use client";

import { Fragment, useCallback, useState, useTransition } from "react";

import { aspectRatioList, getCroppedImg, type Area } from "@/lib/helpers";
import { type FileMetadata } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Cropper, CropperCropArea, CropperDescription, CropperImage } from "@/components/ui/cropper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function EditImage({ preview, file }: { preview: string; file: File | FileMetadata }) {
	const [croppedFile, setCroppedFile] = useState<File | null>(null);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
	const [aspectRatio, setAspectRatio] = useState<number>(1 / 1);
	const [outputWidth, setOutputWidth] = useState<number | undefined>(undefined);
	const [outputHeight, setOutputHeight] = useState<number | undefined>(undefined);

	const [isPending, startTransition] = useTransition();

	const handleCropChange = useCallback((pixels: Area | null) => {
		setCroppedAreaPixels(pixels);
	}, []);

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
			<Card className="mt-12 h-[65dvh] overflow-hidden rounded-xl border">
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
				<CardFooter className="grid grid-cols-1 gap-x-6 gap-y-4 p-4 lg:grid-cols-4">
					<div className="space-y-2">
						<Label>Aspect Ratio</Label>
						<Select
							defaultValue={`${aspectRatio}`}
							onValueChange={(value) => {
								const aspectRatioValue = Number(value);
								setAspectRatio(aspectRatioValue);
								if (outputWidth) {
									setOutputHeight(Math.round(outputWidth / aspectRatioValue));
								}
							}}
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
						<Label>Output Width</Label>
						<Input
							type="number"
							placeholder="Auto"
							value={outputWidth || undefined}
							onChange={(e) => {
								const width = Number(e.target.value);
								setOutputWidth(width);
								setOutputHeight(Math.round(width / aspectRatio));
								return width;
							}}
						/>
					</div>
					<div className="space-y-2">
						<Label>Output Height</Label>
						<Input
							type="number"
							placeholder="Auto"
							value={outputHeight || undefined}
							onChange={(e) => {
								const height = Number(e.target.value);
								setOutputHeight(height);
								setOutputWidth(Math.round(height * aspectRatio));
								return height;
							}}
						/>
					</div>
					<Button className="mt-auto" onClick={handleCrop} disabled={isPending || !croppedAreaPixels}>
						Crop Image
					</Button>
				</CardFooter>
			</Card>
		</Fragment>
	);
}
