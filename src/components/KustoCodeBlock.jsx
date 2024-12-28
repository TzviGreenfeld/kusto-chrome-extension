import React, { useEffect, useMemo } from 'react';
import Prism from 'prismjs';
import { Menu, Item, useContextMenu } from 'react-contexify';

import { BsClipboard } from 'react-icons/bs';

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
  const highlightedCode = useMemo(() => {
    return Prism.highlight(code, Prism.languages.kusto, 'kusto');
  }, [code]);

  useEffect(() => {
    Prism.highlightAll();
  }, [highlightedCode]);

  return (
    <div className="code-block-container">
      <pre>
        <code
          // data-prismjs-copy="" // override the word "Copy"
          // data-prismjs-copy-success="" // override the word "Copied!"
          className={`language-kusto keep-markup ${
            // TODO: fix  code-content

            showLineNumbers ? 'line-numbers ' : ''
          }`}
          dangerouslySetInnerHTML={{ __html: code }}
        ></code>
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
  const { show } = useContextMenu({ id: contextMenuId });

  function handleContextMenu(event) {
    show({
      event,
      props: {
        key: 'value',
      },
    });
  }
  if (!(typeof code === 'string')) {
    console.log('KustoCodeBlock  code:', code);
  }
  const highlightedCode = highlightWord(code, words);

  return (
    <>
      <div className="container" onContextMenu={handleContextMenu}>
        {title && <span className="title">{title}</span>}
        <KustoCodeBlock code={highlightedCode} />
        <Menu id={contextMenuId}>
          {menuItems.map(({ id, label, onOptionClick }) => (
            <Item
              key={id}
              id={id}
              onClick={() => onOptionClick(id, code)}
              className={`menu-item ${id}`}
            >
              {label}
            </Item>
          ))}
        </Menu>
      </div>
    </>
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
