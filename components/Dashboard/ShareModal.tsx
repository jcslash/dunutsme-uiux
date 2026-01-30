import React, { memo, useCallback, useState } from 'react';
import { CloseIcon, CopyIcon, TwitterIcon } from '../visuals/Icons';
import { DonutLogoIcon } from '../visuals/Icons';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

export const ShareModal: React.FC<ShareModalProps> = memo(({ isOpen, onClose, username }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `donutsme.app/${username}`;
  const fullUrl = `https://${shareUrl}`;

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [fullUrl]);

  const handleShareTwitter = useCallback(() => {
    const text = encodeURIComponent(`Support me on Donuts Me! 🍩`);
    const url = encodeURIComponent(fullUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  }, [fullUrl]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-espresso/50 hover:text-espresso transition-colors"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4">
            <DonutLogoIcon />
          </div>
          <h2 className="text-xl font-bold text-espresso">Share your page</h2>
          <p className="text-espresso/60 text-sm mt-1">Let your audience know they can support you</p>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          {/* Copy Link */}
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-espresso/10 hover:border-glaze-pink hover:bg-glaze-pink/5 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-espresso/5 flex items-center justify-center">
              <CopyIcon className="w-5 h-5 text-espresso" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-espresso">
                {copied ? '✓ Copied!' : 'Copy link'}
              </p>
              <p className="text-sm text-espresso/50 truncate">{shareUrl}</p>
            </div>
          </button>

          {/* Share on Twitter */}
          <button
            onClick={handleShareTwitter}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-espresso/10 hover:border-glaze-pink hover:bg-glaze-pink/5 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
              <TwitterIcon className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-espresso">Share on X (Twitter)</p>
              <p className="text-sm text-espresso/50">Post to your followers</p>
            </div>
          </button>
        </div>

        {/* QR Code Placeholder */}
        <div className="mt-6 pt-6 border-t border-espresso/10 text-center">
          <p className="text-sm text-espresso/40">QR code coming soon</p>
        </div>
      </div>
    </div>
  );
});

ShareModal.displayName = 'ShareModal';
