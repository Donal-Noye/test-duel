import styles from "./color-picker.module.scss"

interface ColorPickerProps {
	currentColor: string;
	onColorChange: (color: string) => void;
	name: 'hero1' | 'hero2'
	position?: 'left' | 'right';
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ currentColor, onColorChange, name, position }) => {
	const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

	return (
		<div className={`${styles.wrapper} ${position === 'right' ? styles.right : ''}`}>
			<h3>Select Spell Color</h3>
			<p>{name}</p>
			<div style={{marginBottom: '10px'}}>
				<strong>Current Color: </strong>
				<span className={styles.currentColor} style={{backgroundColor: currentColor}}>
          {currentColor}
        </span>
			</div>
			{colors.map(color => (
				<button
					key={color}
					style={{backgroundColor: color}}
					onClick={() => onColorChange(color)}
					className={styles.colors}
				>
					{color}
				</button>
			))}
		</div>
	);
}