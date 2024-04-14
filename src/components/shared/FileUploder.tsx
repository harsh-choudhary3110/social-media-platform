import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploderProps = {
  fieldChage: (FILES: File[]) => void;
  mediaUrl: string;
};

const FileUploder = ({ fieldChage, mediaUrl }: FileUploderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl || "");

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChage(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg"] },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer ${
        isDragActive && "bg-dark-4"
      }`}
    >
      <input {...getInputProps()} />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img src={fileUrl} alt="image" className="file_uploader-img" />
          </div>
          <p className="file_uploader-label">Click or drag photo to replace</p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            src="/assets/icons/file-upload.svg"
            alt="file-upload"
            width={96}
            height={77}
          />
          <h3 className="base-medium text-light-2 mb-2 mt-6">
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular mb-4">
            SVG, PNG, JPG, Single image
          </p>
          <Button className="shad-button_dark_4">Select from computer</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploder;
