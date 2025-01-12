import React, { ReactNode, MouseEvent } from 'react';
import { Menu, Item, useContextMenu } from 'react-contexify';

interface MenuItem {
  id: string;
  label: string;
  onOptionClick: (props: any) => void;
  style?: React.CSSProperties;
}

interface ContextMenuContainerProps {
  children: ReactNode;
  contextMenuId: string;
  menuItems: MenuItem[];
}

export default function ContextMenuContainer({
  children,
  contextMenuId,
  menuItems,
}: ContextMenuContainerProps) {
  const { show } = useContextMenu({ id: contextMenuId });

  function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
    event.preventDefault();
    show({
      event,
      props: {
        key: 'value',
      },
    });
  }

  return (
    <div className="container" onContextMenu={handleContextMenu}>
      {children}
      <Menu id={contextMenuId}>
        {menuItems.map(({ id, label, onOptionClick, style }) => (
          <Item
            key={id}
            id={id}
            onClick={onOptionClick}
            className={`menu-item ${id}`}
            style={style as React.CSSProperties}
          >
            {label}
          </Item>
        ))}
      </Menu>
    </div>
  );
}
