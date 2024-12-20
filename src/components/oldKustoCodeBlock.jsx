import React from 'react';

import { Menu, Item, useContextMenu } from 'react-contexify';

import { CodeBlock } from 'react-code-block';
import { themes } from 'prism-react-renderer';
import CopyButton from './CopyButton';

import './styles/KustoCodeBlock.css';
import 'react-contexify/dist/ReactContexify.css';

function KustoCodeBlock({
  code,
  title = '',
  language = 'sql',
  words = [],
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
  return (
    <div className="container" onContextMenu={handleContextMenu}>
      {title && <span className="title">{title}</span>}
      <CodeBlock
        code={typeof code === 'string' ? code : ''}
        language={language}
        words={words}
        theme={themes.okaidia}
      >
        <div className="code-block-container">
          <CodeBlock.Code className="code-content">
            <div className="code-row">
              {/* <CodeBlock.LineNumber className="line-number" /> */}
              <CodeBlock.LineContent className="line-content">
                <CodeBlock.Token>
                  {({ isTokenHighlighted, children }) => (
                    <span className={isTokenHighlighted ? 'highlight' : ''}>
                      {children}
                    </span>
                  )}
                </CodeBlock.Token>
              </CodeBlock.LineContent>
            </div>
          </CodeBlock.Code>
          <div className="btn-container">
            <CopyButton code={code} />
          </div>
        </div>
      </CodeBlock>
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
  );
}
export default KustoCodeBlock;
