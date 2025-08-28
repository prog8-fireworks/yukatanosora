// Store
export * from './stores/yukataStore.js';

// Utils
export * from './utils/imageUtils.js';
export * from './utils/ogpManager.js';

// Canvas描画の核心部分
export const drawYukata = (
	canvas: HTMLCanvasElement,
	yukataImage: HTMLImageElement,
	selectedPattern: string,
	selectedColor: string,
	obiColor: string
): void => {
	const ctx = canvas.getContext('2d');
	if (!ctx) return; // null チェック

	const width = canvas.width;
	const height = canvas.height;

	// 1. 背景クリア
	ctx.clearRect(0, 0, width, height);

	// 2. パターン描画
	drawPattern(ctx, selectedPattern, selectedColor, width, height);

	// 3. 浴衣の形でマスク
	ctx.globalCompositeOperation = 'destination-in';
	ctx.drawImage(yukataImage, 0, 0, width, height);

	// 4. 黒い線を重ね描き
	ctx.globalCompositeOperation = 'multiply';
	ctx.drawImage(yukataImage, 0, 0, width, height);

	// // 5. 帯の部分の線画を消す
	// maskObiArea(ctx, width, height);

	// 6. 帯の色を重ね描き
	drawObiColor(ctx, obiColor, width, height);

	// リセット
	ctx.globalCompositeOperation = 'source-over';
};

// === パターン描画関数 ===
const drawPattern = (
	ctx: CanvasRenderingContext2D,
	pattern: string,
	color: string,
	width: number,
	height: number
): void => {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, width, height);

	if (pattern === 'dots') {
		ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
		for (let x = 20; x < width; x += 40) {
			for (let y = 20; y < height; y += 40) {
				ctx.beginPath();
				ctx.arc(x, y, 8, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	} else if (pattern === 'stripes') {
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
		ctx.lineWidth = 10;
		for (let x = 0; x < width; x += 30) {
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, height);
			ctx.stroke();
		}
	} else if (pattern === 'flowers') {
		ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
		for (let x = 30; x < width; x += 60) {
			for (let y = 30; y < height; y += 60) {
				for (let i = 0; i < 5; i++) {
					ctx.beginPath();
					ctx.arc(
						x + Math.cos((i * Math.PI * 2) / 5) * 8,
						y + Math.sin((i * Math.PI * 2) / 5) * 8,
						6,
						0,
						Math.PI * 2
					);
					ctx.fill();
				}
				ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
				ctx.beginPath();
				ctx.arc(x, y, 4, 0, Math.PI * 2);
				ctx.fill();
				ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
			}
		}
	} else if (pattern === 'waves') {
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
		ctx.lineWidth = 3;
		for (let y = 20; y < height; y += 40) {
			ctx.beginPath();
			ctx.moveTo(0, y);
			for (let x = 0; x < width; x += 20) {
				ctx.quadraticCurveTo(x + 10, y - 10, x + 20, y);
			}
			ctx.stroke();
		}
	}
};

// 帯の色を描画する関数
const drawObiColor = (
	ctx: CanvasRenderingContext2D,
	obiColor: string,
	width: number,
	height: number,
	opacity = 0.9
): void => {
	const originalAlpha = ctx.globalAlpha;

	// 透明度を設定
	ctx.globalAlpha = opacity;
	ctx.globalCompositeOperation = 'source-over';
	ctx.fillStyle = obiColor;

	// 帯っぽい形状を描画（角丸の長方形）
	const x = width * 0.35;
	const y = height * 0.365;
	const w = width * 0.32;
	const h = height * 0.092;

	ctx.beginPath();
	ctx.roundRect(x, y, w, h, 5);
	ctx.fill();

	// 元に戻す
	ctx.globalAlpha = originalAlpha;
};
