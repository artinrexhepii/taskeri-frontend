import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatBytes } from '../../../utils/formatters';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  onFileRemove?: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
  selectedFiles?: File[];
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  onFileRemove,
  accept,
  maxSize,
  multiple = false,
  className = '',
  selectedFiles = []
}) => {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFileSelect(acceptedFiles);
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple
  });

  return (
    <div className={className}>
      {/* Dropzone area */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6
          transition-colors cursor-pointer
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary'}
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <DocumentIcon className="h-12 w-12 text-text-secondary" />
          <div>
            <p className="text-sm text-text-primary font-medium">
              {isDragActive
                ? 'Drop files here'
                : 'Drag and drop files here, or click to select'}
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {maxSize
                ? `Maximum file size: ${formatBytes(maxSize)}`
                : 'No file size limit'}
            </p>
          </div>
        </div>
      </div>

      {/* Selected files preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-3 bg-background-main rounded-md"
            >
              <div className="flex items-center space-x-3">
                <DocumentIcon className="h-5 w-5 text-text-secondary" />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {file.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>
              {onFileRemove && (
                <button
                  type="button"
                  onClick={() => onFileRemove(file)}
                  className="p-1 rounded-md hover:bg-background-paper text-text-secondary"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;