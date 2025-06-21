"use client";

import { Fragment } from "react";
import { UploadIcon } from "lucide-react";

import { useFileUpload, type FileWithPreview } from "@/hooks/use-file-upload";
import { EditImage } from "@/components/edit-image";

export function Crop() {
	const [
		{ files, isDragging },
		{ handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps }
	] = useFileUpload({ accept: "image/png,image/jpeg,image/jpg,image/gif,image/webp", maxFiles: 1 });

	const file: FileWithPreview | null = files[0];

	return (
		<Fragment>
			<section className="w-full">
				<div
					onClick={openFileDialog}
					onDrop={handleDrop}
					onDragEnter={handleDragEnter}
					onDragLeave={handleDragLeave}
					onDragOver={handleDragOver}
					data-dragging={isDragging || undefined}
					data-files={files.length > 0 || undefined}
					className="border-input data-[dragging=true]:bg-accent/50 hover:bg-accent/50 relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors"
				>
					<input {...getInputProps()} className="sr-only" aria-label="Upload image file" />
					<div className="flex flex-col items-center gap-2 p-8">
						<UploadIcon width={20} height={20} />
						<p className="text-sm font-medium">Drop your image here or Click to upload</p>
					</div>
				</div>
			</section>

			{file?.preview && <EditImage preview={file.preview} file={file.file} />}
		</Fragment>
	);
}
