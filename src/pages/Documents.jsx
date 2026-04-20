import { useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useDocuments } from '../hooks/useTrips';
import {
  Upload,
  FileText,
  Image,
  File,
  Trash2,
  ExternalLink,
  CloudUpload,
} from 'lucide-react';

function fileIcon(type) {
  if (type?.startsWith('image/')) return Image;
  if (type?.includes('pdf')) return FileText;
  return File;
}

function formatFileSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function Documents() {
  const { trip } = useOutletContext();
  const { documents, loading, upload, remove } = useDocuments(trip.id);
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      await upload(file);
    } catch (err) {
      console.error('Failed to upload:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDelete = async (docItem) => {
    if (!window.confirm(`Delete "${docItem.name}"?`)) return;
    try {
      await remove(docItem.id, docItem.storagePath);
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        className={`card border-2 border-dashed transition-colors text-center py-10 cursor-pointer ${
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/40'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="spinner" />
            <p className="text-sm text-text-secondary">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <CloudUpload size={24} className="text-primary-light" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">
                Drop a file here or click to browse
              </p>
              <p className="text-xs text-text-muted mt-1">
                Tickets, ID proofs, hotel bookings, etc.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Document List */}
      <div className="card">
        <h3 className="text-base font-semibold text-text-primary mb-4">
          Uploaded Documents ({documents.length})
        </h3>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="spinner" />
          </div>
        ) : documents.length === 0 ? (
          <p className="text-sm text-text-muted text-center py-8">
            No documents uploaded yet.
          </p>
        ) : (
          <div className="space-y-2">
            {documents.map((docItem) => {
              const Icon = fileIcon(docItem.type);
              return (
                <div
                  key={docItem.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-surface-light/50 hover:bg-surface-light transition-colors group animate-fade-in"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-9 h-9 rounded-lg bg-surface-lighter flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-text-secondary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">
                        {docItem.name}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatFileSize(docItem.size)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <a
                      href={docItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-primary/10 text-text-muted hover:text-primary-light transition-colors"
                      title="Open file"
                    >
                      <ExternalLink size={14} />
                    </a>
                    <button
                      onClick={() => handleDelete(docItem)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg hover:bg-danger/10 text-text-muted hover:text-danger"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
