import { useRef, useState, useEffect } from "react";
import HeroMenu from "../HeroMenu/HeroMenu.tsx";
import { ColorPicker } from "../ColorPicker/ColorPicker.tsx";
import styles from "./Game.module.scss"

export interface Hero {
	color: string;
	speed: number;
	fireRate: number;
	spellColor: string;
}

const Game = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	// Состояния для двух героев
	const [hero1, setHero1] = useState<Hero>({
		color: "red",
		speed: 2,
		fireRate: 1000,
		spellColor: "red",
	});
	const [hero2, setHero2] = useState<Hero>({
		color: "blue",
		speed: 2,
		fireRate: 1000,
		spellColor: "blue",
	});

	// Состояние для отслеживания выбранного героя (для изменения цвета пуль)
	const [selectedHero, setSelectedHero] = useState<"hero1" | "hero2" | null>(null);

	// Состояния для отслеживания счетов двух героев
	const [score1, setScore1] = useState<number>(0);
	const [score2, setScore2] = useState<number>(0);

	let hero1YPos = 300;  // Начальная вертикальная позиция героя 1
	let hero2YPos = 300;  // Начальная вертикальная позиция героя 2
	let hero1Direction = 1;  // Направление движения героя 1
	let hero2Direction = 1;  // Направление движения героя 2

	// Функция для изменения цвета пуль в зависимости от выбранного героя
	const handleColorChange = (color: string) => {
		if (selectedHero === "hero1") {
			setHero1((prevHero) => ({ ...prevHero, spellColor: color }));
		} else if (selectedHero === "hero2") {
			setHero2((prevHero) => ({ ...prevHero, spellColor: color }));
		}
	};

	// Функция для обработки движения курсора и отражения героев от границ
	const handleMouseMove = (event: MouseEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const mouseX = event.clientX - rect.left;
		const mouseY = event.clientY - rect.top;

		const canvasWidth = canvas.width;

		// Проверка на столкновение курсора с героями
		if (Math.abs(mouseX - 50) < 20 && Math.abs(mouseY - hero1YPos) < 20) {
			hero1Direction *= -1;
		}

		if (
			Math.abs(mouseX - (canvasWidth - 50)) < 20 &&
			Math.abs(mouseY - hero2YPos) < 20
		) {
			hero2Direction *= -1;
		}
	};

	// Основной useEffect для работы с канвасом
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const canvasWidth = canvas.width;
		const canvasHeight = canvas.height;

		// Массивы для хранения пуль
		let spells1: { x: number; y: number }[] = [];
		let spells2: { x: number; y: number }[] = [];

		// Основная функция для отрисовки на канвасе
		const draw = () => {
			// Очищаем холст
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);

			// Обновляем позиции героев
			hero1YPos += hero1Direction * hero1.speed;
			hero2YPos += hero2Direction * hero2.speed;

			// Отталкивание от верхнего и нижнего края
			if (hero1YPos <= 20 || hero1YPos >= canvasHeight - 20)
				hero1Direction *= -1;
			if (hero2YPos <= 20 || hero2YPos >= canvasHeight - 20)
				hero2Direction *= -1;

			// Отрисовка героя 1
			ctx.fillStyle = hero1.color;
			ctx.beginPath();
			ctx.arc(50, hero1YPos, 20, 0, Math.PI * 2);
			ctx.fill();

			// Отрисовка героя 2
			ctx.fillStyle = hero2.color;
			ctx.beginPath();
			ctx.arc(canvasWidth - 50, hero2YPos, 20, 0, Math.PI * 2);
			ctx.fill();

			// Обновление позиций пуль героя 1 и проверка на столкновения
			spells1 = spells1.filter((spell) => {
				spell.x += 5;
				if (spell.x > canvasWidth) return false;
				if (
					spell.x > canvasWidth - 70 &&
					Math.abs(spell.y - hero2YPos) < 20
				) {
					setScore1((prevScore) => prevScore + 1);
					return false; // Удаляем пулю
				}
				ctx.fillStyle = hero1.spellColor; // Используем spellColor для пули
				ctx.beginPath();
				ctx.arc(spell.x, spell.y, 5, 0, Math.PI * 2);
				ctx.fill();
				return true;
			});

			// Обновление позиций пуль героя 2 и проверка на столкновения
			spells2 = spells2.filter((spell) => {
				spell.x -= 5;
				if (spell.x < 0) return false;
				if (spell.x < 70 && Math.abs(spell.y - hero1YPos) < 20) {
					setScore2((prevScore) => prevScore + 1);
					return false; // Удаляем пулю
				}
				ctx.fillStyle = hero2.spellColor; // Используем spellColor для пули
				ctx.beginPath();
				ctx.arc(spell.x, spell.y, 5, 0, Math.PI * 2);
				ctx.fill();
				return true;
			});

			// Запускаем следующую итерацию отрисовки
			requestAnimationFrame(draw);
		};

		draw();

		// Интервалы для создания новых пуль
		const interval1 = setInterval(() => {
			spells1.push({ x: 70, y: hero1YPos });
		}, hero1.fireRate);

		const interval2 = setInterval(() => {
			spells2.push({ x: canvasWidth - 70, y: hero2YPos });
		}, hero2.fireRate);

		// Обработчик кликов на канвасе для выбора героя
		const handleCanvasClick = (event: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;

			// Проверка, попал ли клик по герою 1
			if (Math.abs(mouseX - 50) < 20 && Math.abs(mouseY - hero1YPos) < 20) {
				setSelectedHero('hero1');
			}
			// Проверка, попал ли клик по герою 2
			else if (Math.abs(mouseX - (canvasWidth - 50)) < 20 && Math.abs(mouseY - hero2YPos) < 20) {
				setSelectedHero('hero2');
			}
		};

		// Добавляем обработчики событий на канвас
		canvas.addEventListener('click', handleCanvasClick);
		canvas.addEventListener("mousemove", handleMouseMove);

		// Очистка при размонтировании компонента
		return () => {
			canvas.removeEventListener('click', handleCanvasClick);
			canvas.removeEventListener("mousemove", handleMouseMove);
			clearInterval(interval1);
			clearInterval(interval2);
		};
	}, [hero1, hero2]);

	return (
		<>
			<div className={styles.scoreTable}>
				<div className={styles.item}>
					Hero 1
					<p>{score1}</p>
				</div>
				<div className={styles.item}>
					Hero 2
					<p>{score2}</p>
				</div>
			</div>
			<canvas className={styles.canvas} ref={canvasRef} width={800} height={600}/>
			<div className={styles.menus}>
				<HeroMenu hero={hero1} setHero={setHero1} title="Hero 1"/>
				<HeroMenu hero={hero2} setHero={setHero2} title="Hero 2"/>
			</div>
			{selectedHero && (
				<ColorPicker
					name={selectedHero}
					currentColor={
						selectedHero === "hero1" ? hero1.spellColor : hero2.spellColor
					}
					onColorChange={handleColorChange}
					position={selectedHero === 'hero2' ? 'right' : 'left'}
				/>
			)}
		</>
	);
};

export default Game;
