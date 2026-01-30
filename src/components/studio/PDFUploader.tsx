import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileUp, FileText, AlertTriangle, ExternalLink, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface UploadedPDF {
  id: string;
  name: string;
  size: number;
  source: 'local' | 'url';
  url?: string;
  uploadedAt: Date;
}

export function PDFUploader() {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadedPDFs, setUploadedPDFs] = useState<UploadedPDF[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [acknowledgedCopyright, setAcknowledgedCopyright] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (!acknowledgedCopyright) {
      toast.error('Please acknowledge copyright laws first');
      return;
    }

    Array.from(files).forEach((file) => {
      if (file.type === 'application/pdf') {
        const newPDF: UploadedPDF = {
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          source: 'local',
          uploadedAt: new Date(),
        };
        setUploadedPDFs((prev) => [...prev, newPDF]);
        toast.success(`Uploaded ${file.name}`);
      } else {
        toast.error(`${file.name} is not a PDF`);
      }
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleURLUpload = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    if (!acknowledgedCopyright) {
      toast.error('Please acknowledge copyright laws first');
      return;
    }

    if (!urlInput.toLowerCase().endsWith('.pdf')) {
      toast.warning('URL should point to a PDF file');
    }

    const newPDF: UploadedPDF = {
      id: crypto.randomUUID(),
      name: urlInput.split('/').pop() || 'External PDF',
      size: 0,
      source: 'url',
      url: urlInput,
      uploadedAt: new Date(),
    };
    setUploadedPDFs((prev) => [...prev, newPDF]);
    setUrlInput('');
    toast.success('PDF link added');
  };

  const removePDF = (id: string) => {
    setUploadedPDFs((prev) => prev.filter((pdf) => pdf.id !== id));
    toast.success('PDF removed');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return 'External';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileUp className="w-4 h-4" />
          PDF Upload
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            PDF Document Upload
          </DialogTitle>
          <DialogDescription>
            Upload PDF files from your device or external sites
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Copyright Acknowledgment */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-warning/10 border border-warning/30"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Copyright Notice</p>
                <p className="text-xs text-muted-foreground">
                  By uploading PDF documents, you confirm that you have the legal right to use 
                  this content and that it does not infringe on any copyrights. We follow all 
                  applicable copyright laws and regulations.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Checkbox
                    id="copyright"
                    checked={acknowledgedCopyright}
                    onCheckedChange={(checked) => setAcknowledgedCopyright(checked === true)}
                  />
                  <Label htmlFor="copyright" className="text-xs cursor-pointer">
                    I acknowledge and agree to the copyright terms
                  </Label>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Local Upload */}
          <div className="space-y-2">
            <Label className="text-sm">Upload from Device</Label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                acknowledgedCopyright
                  ? 'border-border hover:border-primary/50 cursor-pointer'
                  : 'border-muted cursor-not-allowed opacity-50'
              }`}
              onClick={() => acknowledgedCopyright && fileInputRef.current?.click()}
            >
              <FileUp className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to browse or drag PDF files here
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                multiple
                className="hidden"
                onChange={handleFileUpload}
                disabled={!acknowledgedCopyright}
              />
            </div>
          </div>

          {/* URL Upload */}
          <div className="space-y-2">
            <Label className="text-sm">Upload from URL</Label>
            <div className="flex gap-2">
              <Input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/document.pdf"
                disabled={!acknowledgedCopyright}
              />
              <Button
                onClick={handleURLUpload}
                disabled={!acknowledgedCopyright}
                size="icon"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedPDFs.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm">Uploaded Documents ({uploadedPDFs.length})</Label>
              <ScrollArea className="h-[150px]">
                <div className="space-y-2">
                  {uploadedPDFs.map((pdf) => (
                    <motion.div
                      key={pdf.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-2 rounded-lg bg-muted/50 border border-border/50"
                    >
                      <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{pdf.name}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {formatFileSize(pdf.size)} • {pdf.source === 'url' ? 'External' : 'Local'}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 hover:text-destructive"
                        onClick={() => removePDF(pdf.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <p className="text-[10px] text-muted-foreground flex-1">
            See our <a href="/legal" className="text-primary underline">Legal & Copyright Policy</a> for more information.
          </p>
          <Button onClick={() => setIsOpen(false)}>
            <Check className="w-4 h-4 mr-1" />
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
