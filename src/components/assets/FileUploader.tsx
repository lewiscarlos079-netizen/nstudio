import { useCallback, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, File, X, CheckCircle, AlertCircle, User, Mail, Globe, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore, AssetDeveloperInfo } from '@/store/projectStore';
import { toast } from 'sonner';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'pending' | 'processing' | 'success' | 'error';
  url?: string;
  developer?: AssetDeveloperInfo;
}

const ACCEPTED_FORMATS = ['.gltf', '.glb', '.obj', '.fbx', '.stl', '.dae', '.3ds', '.zip'];
const METADATA_FILES = ['readme.txt', 'readme.md', 'license.txt', 'license.md', 'credits.txt', 'author.txt', 'info.txt', 'metadata.json'];

// Parse developer info from common metadata file formats
function parseDeveloperInfo(content: string, fileName: string): AssetDeveloperInfo {
  const info: AssetDeveloperInfo = { name: 'Unknown Developer' };
  
  // Try JSON format first
  if (fileName.endsWith('.json')) {
    try {
      const json = JSON.parse(content);
      info.name = json.author || json.creator || json.developer || json.name || 'Unknown Developer';
      info.email = json.email || json.contact;
      info.website = json.website || json.url || json.homepage;
      info.license = json.license;
      info.attribution = json.attribution || json.credits;
      return info;
    } catch {
      // Continue with text parsing
    }
  }
  
  const lines = content.split('\n');
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // Author/Creator patterns
    if (lowerLine.includes('author:') || lowerLine.includes('creator:') || lowerLine.includes('by:') || lowerLine.includes('developer:')) {
      const match = line.match(/(?:author|creator|by|developer)[:\s]+(.+)/i);
      if (match) info.name = match[1].trim();
    }
    
    // Email patterns
    const emailMatch = line.match(/[\w.-]+@[\w.-]+\.\w+/);
    if (emailMatch) info.email = emailMatch[0];
    
    // Website patterns
    const urlMatch = line.match(/https?:\/\/[^\s]+/);
    if (urlMatch) info.website = urlMatch[0];
    
    // License patterns
    if (lowerLine.includes('license:') || lowerLine.includes('licence:')) {
      const match = line.match(/licen[cs]e[:\s]+(.+)/i);
      if (match) info.license = match[1].trim();
    }
    
    // Attribution patterns
    if (lowerLine.includes('attribution:') || lowerLine.includes('credit:')) {
      const match = line.match(/(?:attribution|credit)[:\s]+(.+)/i);
      if (match) info.attribution = match[1].trim();
    }
  }
  
  // If no name found, try to extract from first non-empty line
  if (info.name === 'Unknown Developer') {
    const firstLine = lines.find(l => l.trim().length > 0 && !l.startsWith('#') && !l.startsWith('//'));
    if (firstLine && firstLine.length < 100) {
      info.name = firstLine.trim();
    }
  }
  
  return info;
}

export function FileUploader() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const addAsset = useProjectStore((s) => s.addAsset);

  const handleFiles = useCallback(async (fileList: FileList | null) => {
    if (!fileList) return;

    const fileArray = Array.from(fileList);
    
    // Separate model files from metadata files
    const modelFiles = fileArray.filter((file) => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      return ACCEPTED_FORMATS.includes(ext);
    });
    
    const metadataFiles = fileArray.filter((file) => {
      return METADATA_FILES.some(meta => file.name.toLowerCase() === meta || file.name.toLowerCase().endsWith(meta));
    });

    // Parse metadata files for developer info
    let developerInfo: AssetDeveloperInfo | undefined;
    
    for (const metaFile of metadataFiles) {
      try {
        const content = await metaFile.text();
        developerInfo = parseDeveloperInfo(content, metaFile.name.toLowerCase());
        if (developerInfo.name !== 'Unknown Developer') {
          toast.success(`Found developer info: ${developerInfo.name}`);
          break;
        }
      } catch (e) {
        console.error('Failed to parse metadata file:', e);
      }
    }

    const newFiles: UploadedFile[] = modelFiles.map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
      status: 'pending' as const,
      developer: developerInfo,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Process files and add to store
    newFiles.forEach((uploadedFile) => {
      // Update to processing state
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id ? { ...f, status: 'processing' as const } : f
          )
        );
      }, 500);
      
      // Complete processing
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadedFile.id ? { ...f, status: 'success' as const } : f
          )
        );
        
        // Add to project store with developer info
        addAsset({
          name: uploadedFile.name.replace(/\.[^/.]+$/, ''),
          type: 'model',
          source: 'local',
          thumbnail: '',
          developer: uploadedFile.developer,
          fileSize: uploadedFile.size,
          fileFormat: uploadedFile.type.toLowerCase(),
        });
        
        toast.success(
          `Added: ${uploadedFile.name}${uploadedFile.developer?.name ? ` by ${uploadedFile.developer.name}` : ''}`
        );
      }, 1500 + Math.random() * 1000);
    });
  }, [addAsset]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Drop Zone */}
      <Card
        className={`relative border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-primary/30 hover:border-primary/50 bg-card/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept={[...ACCEPTED_FORMATS, '.txt', '.md', '.json'].join(',')}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className={`p-4 rounded-full mb-4 transition-colors ${
            isDragging ? 'bg-primary/20' : 'bg-muted/50'
          }`}>
            <Upload className={`w-8 h-8 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <h3 className="font-display text-lg font-semibold mb-2">
            {isDragging ? 'Drop files here' : 'Upload 3D Models'}
          </h3>
          <p className="text-muted-foreground text-sm text-center max-w-md mb-4">
            Drag and drop your 3D files here, or click to browse
          </p>
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {ACCEPTED_FORMATS.map((format) => (
              <Badge key={format} variant="outline" className="text-xs">
                {format}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded-lg">
            <FileText className="w-4 h-4" />
            <span>Include readme.txt, license.txt, or metadata.json for developer attribution</span>
          </div>
        </div>
      </Card>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <h4 className="font-medium text-sm text-muted-foreground">
              Uploaded Files ({files.length})
            </h4>
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="p-3 bg-card border-primary/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <File className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{file.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatSize(file.size)}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {file.type}
                        </Badge>
                      </div>
                      {file.developer && file.status === 'success' && (
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{file.developer.name}</span>
                          </div>
                          {file.developer.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span>{file.developer.email}</span>
                            </div>
                          )}
                          {file.developer.website && (
                            <a 
                              href={file.developer.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 hover:text-primary transition-colors"
                            >
                              <Globe className="w-3 h-3" />
                              <span>Website</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {file.status === 'pending' && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span>Waiting...</span>
                        </div>
                      )}
                      {file.status === 'processing' && (
                        <div className="flex items-center gap-2 text-xs text-primary">
                          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      )}
                      {file.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {file.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-destructive" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFile(file.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
