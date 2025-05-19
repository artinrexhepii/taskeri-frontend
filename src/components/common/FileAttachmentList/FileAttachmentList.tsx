import React from 'react';
import { DocumentIcon, TrashIcon } from '@heroicons/react/24/outline';
import { FileAttachmentResponse } from '../../../types/file.types';
import Button from '../Button/Button';

interface FileAttachmentListProps {
  attachments: FileAttachmentResponse[];
  onDelete?: (attachment: FileAttachmentResponse) => void;
  onDownload?: (attachment: FileAttachmentResponse) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const FileAttachmentList: React.FC<FileAttachmentListProps> = ({
  attachments,
  onDelete,
  onDownload,
  isLoading,
  emptyMessage = 'No attachments found'
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (attachments.length === 0) {
    return (
      <div className="text-center py-8 text-text-secondary">
        {emptyMessage}
      </div>
    );
  }

  const getFileNameFromPath = (path: string) => {
    return path.split('/').pop() || path;
  };

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="flex items-center justify-between p-3 bg-background-main rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <DocumentIcon className="h-6 w-6 text-text-secondary" />
            </div>
            <div>
              <h4 className="text-sm font-medium text-text-primary">
                {getFileNameFromPath(attachment.file_path)}
              </h4>
              <p className="text-xs text-text-secondary">
                Uploaded on {new Date(attachment.uploaded_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {onDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDownload(attachment)}
              >
                Download
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                size="sm"
                onClick={() => onDelete(attachment)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileAttachmentList;