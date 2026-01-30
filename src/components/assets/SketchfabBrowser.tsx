import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Search, Download, ExternalLink, Loader2, Box } from 'lucide-react';

interface SketchfabModel {
  uid: string;
  name: string;
  thumbnails: {
    images: Array<{ url: string; width: number }>;
  };
  viewerUrl: string;
  user: {
    displayName: string;
  };
  likeCount: number;
  viewCount: number;
  isDownloadable: boolean;
}

export function SketchfabBrowser() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SketchfabModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchSketchfab = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(true);
    
    try {
      // Sketchfab public API - no auth required for search
      const response = await fetch(
        `https://api.sketchfab.com/v3/search?type=models&q=${encodeURIComponent(query)}&downloadable=true`
      );
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Sketchfab search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchSketchfab();
    }
  };

  const getThumbnail = (model: SketchfabModel) => {
    const images = model.thumbnails?.images || [];
    const medium = images.find(img => img.width >= 200 && img.width <= 400);
    return medium?.url || images[0]?.url || '';
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search Sketchfab for 3D models..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 bg-card border-primary/20"
          />
        </div>
        <Button variant="cyber" onClick={searchSketchfab} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
        </Button>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {results.map((model, index) => (
            <motion.div
              key={model.uid}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="group bg-card border-primary/10 hover:border-primary/30 transition-all overflow-hidden">
                <div className="aspect-square bg-muted/50 relative overflow-hidden">
                  {getThumbnail(model) ? (
                    <img
                      src={getThumbnail(model)}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Box className="w-12 h-12 text-muted-foreground/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="glass"
                        className="h-8"
                        asChild
                      >
                        <a
                          href={model.viewerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </Button>
                      {model.isDownloadable && (
                        <Button
                          size="sm"
                          variant="glass"
                          className="h-8"
                          asChild
                        >
                          <a
                            href={`${model.viewerUrl}/download`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="font-medium text-sm truncate" title={model.name}>
                    {model.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    by {model.user.displayName}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      {model.viewCount.toLocaleString()} views
                    </Badge>
                    {model.isDownloadable && (
                      <Badge variant="secondary" className="text-xs">
                        Free
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : searched ? (
        <div className="text-center py-16">
          <Box className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold mb-2">No Results</h3>
          <p className="text-muted-foreground">Try a different search term</p>
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="font-display text-xl font-semibold mb-2">Search Sketchfab</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Browse millions of free 3D models from Sketchfab's library. 
            Search for characters, environments, props, and more.
          </p>
        </div>
      )}
    </div>
  );
}
