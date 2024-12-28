import React, { useEffect } from 'react';
import Prism from 'prismjs';

import 'prismjs/components/prism-kusto';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';

import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/themes/prism-okaidia.css';

import './styles/SimpleKustoCodeBlock.css';

export default function SimpleKustoCodeBlock({
  code,
  showLineNumbers = false,
}) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <div className="code-block-container">
      <pre>
        <code
          className={`language-kusto ${showLineNumbers ? 'line-numbers ' : ''}`}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}
