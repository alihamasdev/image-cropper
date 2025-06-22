"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { UploadIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useFileUpload, type FileWithPreview } from "@/hooks/use-file-upload";
import { EditImage } from "@/components/edit-image";

export function Crop() {
	const [
		{ files, isDragging },
		{ handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps }
	] = useFileUpload({ accept: "image/png,image/jpeg,image/jpg,image/gif,image/webp", maxFiles: 1 });

	const [file, setFile] = useState<FileWithPreview | null>(files[0] || null);

	const editBoxRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (file && editBoxRef.current) {
			editBoxRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
		}
	}, [file]);

	useEffect(() => {
		setFile(files[0] || null);
	}, [files]);

	return (
		<Fragment>
			<section
				onClick={openFileDialog}
				onDrop={handleDrop}
				onDragEnter={handleDragEnter}
				onDragLeave={handleDragLeave}
				onDragOver={handleDragOver}
				data-dragging={isDragging || undefined}
				data-files={files.length > 0 || undefined}
				className={cn(
					"border-input data-[dragging=true]:bg-accent/50 hover:bg-accent/50 relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors",
					file ? "h-30" : "h-[65dvh]"
				)}
			>
				<input {...getInputProps()} className="sr-only" aria-label="Upload image file" />
				<div className="flex flex-col items-center gap-2 px-10">
					<UploadIcon className="size-5" />
					<p className="text-center text-sm font-medium">Drop your image here or Click to upload</p>
				</div>
			</section>

			{file && file.preview && <EditImage preview={file.preview} file={file.file} ref={editBoxRef} />}
		</Fragment>
	);
}
