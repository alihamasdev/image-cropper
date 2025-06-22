"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const imageFormats = ["png", "jpeg", "jpg", "gif", "webp"];

export function FinalResult({
	croppedFile,
	outputWidth,
	outputHeight,
	...props
}: React.ComponentProps<typeof Card> & {
	croppedFile: File;
	outputWidth: number | undefined;
	outputHeight: number | undefined;
}) {
	const imageSize = croppedFile.size / 1024 / 1024;

	const [imageName, setImageName] = useState(croppedFile.name.split(".")[0]);
	const [imageFormat, setImageFormat] = useState(croppedFile.type.split("/")[1]);

	const handleDownload = () => {
		if (!imageName) {
			toast("Name cannot be empty");
			return;
		}

		const url = URL.createObjectURL(croppedFile);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${imageName}.${imageFormat}`;
		document.body.appendChild(link);

		link.click();

		document.body.removeChild(link);
		window.URL.revokeObjectURL(url);
	};

	return (
		<Card className="w-full overflow-hidden" {...props}>
			<CardHeader className="p-4">
				<CardTitle>Final Result</CardTitle>
			</CardHeader>
			<CardContent className="grid grid-cols-1 px-0 md:grid-cols-2">
				<div className="size-full">
					<Image
						src={URL.createObjectURL(croppedFile)}
						width={outputWidth}
						height={outputHeight}
						alt={imageName}
						className="size-full object-cover object-center"
					/>
				</div>
				<div className="space-y-4 p-4 lg:px-8 lg:py-6">
					<div className="space-y-2">
						<Label>Name</Label>
						<Input value={imageName} onChange={(e) => setImageName(e.target.value)} />
					</div>
					<div className="space-y-2">
						<Label>Format</Label>
						<Select defaultValue={imageFormat} onValueChange={(value) => setImageFormat(value)}>
							<SelectTrigger className="w-full uppercase">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="uppercase">
								{imageFormats.map((value) => (
									<SelectItem key={value} value={value}>
										{value}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>Size</Label>
						<Input value={`~ ${imageSize.toFixed(1)} MB`} readOnly />
					</div>
					<div className="space-y-2">
						<Label>Dimensions</Label>
						<Input value={`${outputWidth} x ${outputHeight}`} readOnly />
					</div>
					<Button onClick={handleDownload}>Download</Button>
				</div>
			</CardContent>
		</Card>
	);
}
