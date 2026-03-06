'use client';

import { useState } from 'react';
import { ShareModalProps } from '@/types';

export default function ShareModal({ calculation, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !calculation) return null;

  const handleGenerateLink = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ calculationId: calculation.id }),
      });
      const json = await res.json();
      if (json.data?.shareUrl) {
        setShareUrl(json.data.shareUrl);
      } else {
        setError('Could not generate share link');
      }
    } catch {
      setError('Failed to generate link');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy to clipboard');
    }
  };

  const shareText = `🧮 Supreme Cal\n${calculation.expression} = ${calculation.result}\n\nCalculated with Supreme Cal!`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-md glass rounded-3xl p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <span className="text-sm">📤</span>
            </div>
            <h2 className="text-lg font-bold text-white">Share Calculation</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-brand-surface flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Calculation preview */}
        <div className="bg-brand-dark rounded-2xl p-4 mb-6 border border-brand-border">
          <p className="text-gray-400 text-sm mb-1">{calculation.expression}</p>
          <p className="text-white text-2xl font-light">= {calculation.result}</p>
        </div>

        {/* Share options */}
        <div className="space-y-3">
          {/* Copy calculation text */}
          <button
            onClick={() => handleCopy(shareText)}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-brand-surface border border-brand-border hover:border-purple-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-lg flex-shrink-0">
              📋
            </div>
            <div className="text-left">
              <p className="text-white text-sm font-medium">Copy Text</p>
              <p className="text-gray-500 text-xs">Copy calculation to clipboard</p>
            </div>
            {copied && (
              <span className="ml-auto text-green-400 text-xs font-medium">Copied!</span>
            )}
          </button>

          {/* Generate shareable link */}
          {!shareUrl ? (
            <button
              onClick={handleGenerateLink}
              disabled={loading}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-brand-surface border border-brand-border hover:border-purple-500 transition-all disabled:opacity-50"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center text-lg flex-shrink-0">
                🔗
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium">
                  {loading ? 'Generating...' : 'Generate Link'}
                </p>
                <p className="text-gray-500 text-xs">Create a shareable URL</p>
              </div>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-brand-surface border border-green-500/30">
              <p className="text-green-400 text-xs mb-2 font-medium">✓ Shareable link ready!</p>
              <div className="flex items-center gap-2">
                <p className="text-gray-300 text-xs flex-1 truncate">{shareUrl}</p>
                <button
                  onClick={() => handleCopy(shareUrl)}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          )}

          {/* Native share */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={() => {
                navigator.share({
                  title: 'Supreme Cal',
                  text: shareText,
                  url: shareUrl || window.location.href,
                }).catch(() => {});
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-brand-surface border border-brand-border hover:border-purple-500 transition-all"
            >
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-lg flex-shrink-0">
                📱
              </div>
              <div className="text-left">
                <p className="text-white text-sm font-medium">Share via...</p>
                <p className="text-gray-500 text-xs">Use device share sheet</p>
              </div>
            </button>
          )}
        </div>

        {error && (
          <p className="mt-3 text-red-400 text-sm text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
