import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { convertFileToUrl } from "../../lib/utils";

type ProfileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const ProfileUploader = ({ fieldChange, mediaUrl }: ProfileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(convertFileToUrl(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg"],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`bg-dark-3 rounded-xl w-full p-4 ${
        isDragActive && "bg-dark-4"
      }`}
    >
      <input {...getInputProps()} className="cursor-pointer" />
      <div className="cursor-pointer flex-center flex-col gap-4">
        <img
          src={fileUrl || "/assets/icons/profile-placeholder.svg"}
          alt="image"
          className="h-24 w-24 rounded-full object-cover object-center"
        />
        <div>
          <p className="text-primary-500 small-regular md:base-semibold text-center mb-1">
            Click to change profile photo
          </p>
          <p className="text-light-3 text-center">Or drag image here</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileUploader;
