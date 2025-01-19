import React, { useEffect } from 'react';
import Prism from 'prismjs';

import ContextMenuContainer from './ContextMenuContainer';

import 'prismjs/components/prism-kusto';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/keep-markup/prism-keep-markup.js';
import 'prismjs/plugins/toolbar/prism-toolbar.min';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard.min';

import 'prismjs/plugins/toolbar/prism-toolbar.min.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import 'prismjs/themes/prism-okaidia.css';
import 'react-contexify/dist/ReactContexify.css';
import './styles/KustoCodeBlock.css';

function KustoCodeBlock({ code, showLineNumbers = false }) {
  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <div className="code-block-container">
      <pre>
        <code
          className={`language-kusto keep-markup ${
            showLineNumbers ? 'line-numbers ' : ''
          }`}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}

export default function CodeBlockContainer({
  code,
  title = '',
  words = '',
  contextMenuId = 'default-context-menu',
  menuItems,
}) {
  if (!(typeof code === 'string')) {
    console.error('KustoCodeBlock  code:', code);
  }
  // const highlightedCode = highlightWord(code, words);

  return (
    <ContextMenuContainer contextMenuId={contextMenuId} menuItems={menuItems}>
      {title && <span className="title">{title}</span>}
      <KustoCodeBlock code={code} />
    </ContextMenuContainer>
  );
}

function highlightWord(code, word) {
  if (!word || word.length < 2) {
    return Prism.highlight(code, Prism.languages.kusto, 'kusto');
  }

  const regex = new RegExp(`(${word})`, 'gi');

  const highlighted = code.replace(regex, `<mark class="highlight">$1</mark>`);

  return highlighted;
}
