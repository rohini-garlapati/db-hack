import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload as UploadIcon, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadDocument, UploadResponse } from '@/services/api';
import { formatBytes } from '@/utils/formatters';

interface FileUploadState {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'done' | 'error';
  error?: string;
}

export default function Upload() {
  const [files, setFiles] = useState<FileUploadState[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(f => {
      // Validate size (< 50MB) and type if needed
      return f.size <= 50 * 1024 * 1024;
    });

    const fileStates: FileUploadState[] = validFiles.map(file => ({
      file,
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      progress: 0,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...fileStates].slice(0, 10)); // Max 10
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const uploadFiles = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');
    
    for (const f of pendingFiles) {
      setFiles(prev => prev.map(item => 
        item.id === f.id ? { ...item, status: 'uploading', progress: 0 } : item
      ));

      try {
        await uploadDocument(f.file, (pct) => {
          setFiles(prev => prev.map(item => 
            item.id === f.id ? { ...item, progress: pct } : item
          ));
        });
        
        setFiles(prev => prev.map(item => 
          item.id === f.id ? { ...item, status: 'done', progress: 100 } : item
        ));
      } catch (err: any) {
        setFiles(prev => prev.map(item => 
          item.id === f.id ? { ...item, status: 'error', error: err.message } : item
        ));
      }
    }
  };

  const pendingCount = files.filter(f => f.status === 'pending' || f.status === 'error').length;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Upload Documents</h2>
        <p className="text-muted-foreground">Add files to your AI's knowledge base. Supported formats: PDF, DOCX, CSV, PNG, JPG (Max 50MB).</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div 
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              isDragActive ? 'border-primary bg-primary/5' : 'border-border bg-muted/20'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <UploadIcon className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Click to upload or drag and drop</h3>
            <p className="text-sm text-muted-foreground mb-6">Maximum 10 files per batch</p>
            
            <Button onClick={() => document.getElementById('file-upload')?.click()} variant="outline">
              Select Files
            </Button>
            <input 
              id="file-upload" 
              type="file" 
              multiple 
              className="hidden" 
              onChange={handleFileInput}
              accept=".pdf,.docx,.csv,.png,.jpg,.jpeg"
            />
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-lg">Selected Files ({files.length})</CardTitle>
              <CardDescription>Review your files before uploading.</CardDescription>
            </div>
            <Button onClick={uploadFiles} disabled={pendingCount === 0}>
              Upload {pendingCount > 0 ? pendingCount : ''} Files
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="border rounded-lg p-4 bg-background">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center shrink-0">
                      <File className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate" title={file.file.name}>{file.file.name}</p>
                      <p className="text-xs text-muted-foreground">{formatBytes(file.file.size)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    {file.status === 'done' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
                    {file.status === 'error' && <span title={file.error}><AlertCircle className="w-5 h-5 text-destructive" /></span>}
                    {file.status !== 'uploading' && (
                      <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)} className="h-8 w-8">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                {file.status === 'uploading' && (
                  <div className="space-y-1">
                    <Progress value={file.progress} className="h-1.5" />
                    <p className="text-[10px] text-right text-muted-foreground font-medium">{file.progress}%</p>
                  </div>
                )}
                {file.status === 'error' && (
                  <p className="text-xs text-destructive mt-1">{file.error}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
