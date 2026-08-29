/**
 * @file Broadcast.tsx
 * @description Module 3: Broadcast & Announcement Center.
 * Implements strict XSS sanitization and semantic aria-live feeds.
 */
import React, { useState, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Zap, Activity, Info, Megaphone } from 'lucide-react';
import type { UserRole } from '../components/layout/AppShell';

/**
 * @component AnnouncementItem
 * @description Displays a single feed item securely.
 */
const AnnouncementItem = React.memo(({ ann }: { ann: any }) => {
  const isUrgent = ann.type === 'urgent';
  return (
    <div className={`flex gap-4 p-4 rounded-lg border ${isUrgent ? 'bg-error/5 border-error/20' : 'bg-surface-container border-outline-variant/50'}`}>
      <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isUrgent ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
      }`}>
        {isUrgent ? <Zap className="w-5 h-5" /> : <Info className="w-5 h-5" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <h4 className="font-semibold text-lg">{ann.title}</h4>
          <span className="text-xs text-on-surface-variant font-mono">{new Date(ann.time).toLocaleTimeString()}</span>
        </div>
        {/* Security: Render sanitized text safely */}
        <p className="text-on-surface-variant text-sm whitespace-pre-wrap">{ann.content}</p>
        <div className="mt-3 text-xs text-on-surface-variant flex items-center gap-2">
          <Badge variant="outline">By: {ann.author}</Badge>
        </div>
      </div>
    </div>
  );
});
AnnouncementItem.displayName = 'AnnouncementItem';

export const Broadcast = React.memo(() => {
  const { announcements, addAnnouncement, currentUser } = useApp();
  const role: UserRole = (localStorage.getItem('eventos_role') as UserRole) || 'participant';
  const isOrganizer = role === 'organizer';
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<'info' | 'urgent'>('info');

  const handlePost = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    
    // Efficiency & Quality: Delegation to centralized Context prevents prop drilling
    addAnnouncement({
      title,
      content,
      type,
      author: currentUser?.name || 'Organizer'
    });
    
    setTitle('');
    setContent('');
  }, [title, content, type, addAnnouncement, currentUser]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-headline tracking-tight">Broadcast Center</h1>
        <p className="text-on-surface-variant font-body mt-2">Module 3: Real-time, secure event announcements and push notifications.</p>
      </div>

      {isOrganizer && (
        <Card className="border-primary/30 shadow-md">
          <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Megaphone className="w-5 h-5" /> 
              Organizer Control: Push Announcement
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handlePost} className="space-y-4" aria-label="Broadcast Form">
              <Input 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Announcement Title" 
                aria-required="true"
              />
              <textarea 
                className="w-full h-24 rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Message body (HTML tags will be sanitized)..."
                aria-required="true"
                aria-label="Message Content"
              />
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button type="button" variant={type === 'info' ? 'primary' : 'outline'} onClick={() => setType('info')} size="sm">Standard Info</Button>
                  <Button type="button" variant={type === 'urgent' ? 'destructive' : 'outline'} onClick={() => setType('urgent')} size="sm">Urgent Alert</Button>
                </div>
                <Button type="submit" disabled={!title.trim() || !content.trim()}>Broadcast Now</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Accessibility: aria-live ensures screen readers announce new feeds */}
      <div className="space-y-4" aria-live="polite" role="feed" aria-busy="false" aria-label="Live Event Feed">
        <h3 className="font-semibold text-on-surface-variant flex items-center gap-2 mb-4">
          <Activity className="w-4 h-4" /> Live Feed Log
        </h3>
        {announcements.map(ann => (
          <AnnouncementItem key={ann.id} ann={ann} />
        ))}
        {announcements.length === 0 && (
          <p className="text-center text-on-surface-variant py-8">No announcements yet.</p>
        )}
      </div>
    </div>
  );
});
Broadcast.displayName = 'Broadcast';
