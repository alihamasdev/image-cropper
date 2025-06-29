"use client";

export type Area = { x: number; y: number; width: number; height: number };

export const createImage = (url: string): Promise<HTMLImageElement> =>
	new Promise((resolve, reject) => {
		const image = new Image();
		image.addEventListener("load", () => resolve(image));
		image.addEventListener("error", (error) => reject(error));
		image.setAttribute("crossOrigin", "anonymous");
		image.src = url;
	});

export async function getCroppedImg(
	imageSrc: string,
	pixelCrop: Area,
	outputWidth: number = pixelCrop.width,
	outputHeight: number = pixelCrop.height
): Promise<Blob | null> {
	try {
		const image = await createImage(imageSrc);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) return null;

		canvas.width = outputWidth;
		canvas.height = outputHeight;

		ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, outputWidth, outputHeight);

		return new Promise((resolve) => {
			canvas.toBlob((blob) => resolve(blob), "image/png", 100);
		});
	} catch (error) {
		console.error("Error in getCroppedImg:", error);
		return null;
	}
}

export const aspectRatioList = [
	{ label: "1 : 1", value: 1 / 1 },
	{ label: "2 : 3", value: 2 / 3 },
	{ label: "3 : 2", value: 3 / 2 },
	{ label: "4 : 3", value: 4 / 3 },
	{ label: "9 : 16", value: 9 / 16 },
	{ label: "16 : 9", value: 16 / 9 },
	{ label: "21 : 9", value: 21 / 9 }
];
