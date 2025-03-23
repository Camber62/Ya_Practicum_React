import React, { FC, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { SelectedIngredient } from '../types';

// Константа для типа перетаскиваемого элемента
const ItemTypes = {
	FILLING: 'filling',
};

// Компонент для перетаскиваемой начинки
const DraggableFilling: FC<{
	item: SelectedIngredient;
	index: number;
	onMove: (dragIndex: number, hoverIndex: number) => void;
	onRemove: (index: number) => void;
}> = ({ item, index, onMove, onRemove }) => {
	const ref = useRef<HTMLLIElement>(null);

	// Настройка drag-and-drop
	const [{ isDragging }, drag] = useDrag({
		type: ItemTypes.FILLING,
		item: { index },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	});

	const [, drop] = useDrop({
		accept: ItemTypes.FILLING,
		hover: (draggedItem: { index: number }) => {
			// Пропускаем, если элемент перетаскивается на самого себя
			if (draggedItem.index !== index) {
				onMove(draggedItem.index, index);
				draggedItem.index = index; // Обновляем индекс перетаскиваемого элемента
			}
		},
	});

	// Привязываем drag и drop к одному ref
	drag(drop(ref));

	return (
		<li ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
			<DragIcon type="primary" />
			<ConstructorElement
				text={item.name}
				price={item.price}
				thumbnail={item.image}
				handleClose={() => onRemove(index)}
			/>
		</li>
	);
};

export default DraggableFilling;