import { ReactNode, CSSProperties } from 'react';
import { useVisualEditor } from './VisualEditorContext';

interface EditableProps {
    id: string;
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    as?: keyof JSX.IntrinsicElements;
    onClick?: (e: React.MouseEvent) => void;
}

export function Editable({ id, children, className = '', style = {}, as: Tag = 'div', onClick, ...props }: EditableProps) {
    const { isEditing, selectElement, selectedElementId, overrides } = useVisualEditor();

    const isSelected = selectedElementId === id;
    const elementStyle = overrides[id];

    const handleClick = (e: React.MouseEvent) => {
        if (isEditing) {
            e.preventDefault();
            e.stopPropagation();
            selectElement(id);
        }
        if (onClick) onClick(e);
    };

    const finalStyle: CSSProperties = {
        ...style,
        ...(elementStyle?.fontSize ? { fontSize: elementStyle.fontSize } : {}),
        ...(elementStyle?.color ? { color: elementStyle.color } : {}),
        ...(isEditing && isSelected ? { outline: '2px solid #ef4444', outlineOffset: '2px', cursor: 'default' } : {}),
        ...(isEditing && !isSelected ? { cursor: 'pointer', outline: '1px dashed rgba(255, 255, 255, 0.2)' } : {}),
    };

    // @ts-ignore
    return <Tag className={className} style={finalStyle} onClick={handleClick} {...props}>{children}</Tag>;
}
