/**
 * 画像処理に関するユーティリティ関数
 */

/**
 * 浴衣画像を読み込む
 */
export const loadYukataImage = (imagePath: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = (): void => {
      resolve(img);
    };

    img.onerror = (): void => {
      console.error('浴衣画像の読み込みに失敗しました:', imagePath);
      reject(new Error(`画像読み込み失敗: ${imagePath}`));
    };

    img.src = imagePath;
  });
};

/**
 * Canvasと小物画像を合成して新しいCanvasを作成
 */
export const compositeYukataImage = (
  canvasRef: HTMLCanvasElement,
  containerSelector: string = '.preview-image-wrapper'
): HTMLCanvasElement | null => {
  try {
    // 新しいcanvasを作成して合成
    const compositeCanvas = document.createElement('canvas');
    const container = document.querySelector(containerSelector) as HTMLElement;
    if (!container) return null;

    const containerRect = container.getBoundingClientRect();
    const canvasRect = canvasRef.getBoundingClientRect();
    compositeCanvas.width = Math.round(containerRect.width);
    compositeCanvas.height = Math.round(containerRect.height);

    const compositeCtx = compositeCanvas.getContext('2d');
    if (!compositeCtx) return null;

    // 浴衣のcanvasを描画
    const offsetX = canvasRect.left - containerRect.left;
    const offsetY = canvasRect.top - containerRect.top;
    compositeCtx.drawImage(canvasRef, offsetX, offsetY, canvasRect.width, canvasRect.height);

    // 小物を合成
    const komono = document.querySelectorAll(`${containerSelector} img`);
    for (const img of komono) {
      const htmlImg = img as HTMLImageElement;
      if (htmlImg.complete) {
        const rect = htmlImg.getBoundingClientRect();
        const containerRect = document
          .querySelector(containerSelector)
          ?.getBoundingClientRect();
        if (containerRect) {
          const x = rect.left - containerRect.left;
          const y = rect.top - containerRect.top;
          compositeCtx.drawImage(htmlImg, x, y, rect.width, rect.height);
        }
      }
    }

    return compositeCanvas;
  } catch (error) {
    console.error('画像合成に失敗しました:', error);
    return null;
  }
};

/**
 * Canvasを画像としてダウンロード
 */
export const downloadCanvasAsImage = (
  canvas: HTMLCanvasElement,
  filename: string = 'my-yukata.png'
): void => {
  try {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
  } catch (error) {
    console.error('ダウンロードに失敗しました:', error);
  }
};
