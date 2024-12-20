import React, { useState } from 'react';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import { BsClipboard } from 'react-icons/bs';
import { GoCheck } from 'react-icons/go';
import './styles/CopyButton.css';

export default function CopyButton({ code }) {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    copyToClipboard(code);
    setCopied(true);
  };

  return (
    <button onClick={copyCode} className="copy-button">
      {copied ? <GoCheck /> : <BsClipboard />}
    </button>
  );
}
