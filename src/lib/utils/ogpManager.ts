import { compositeYukataImage } from './imageUtils.js';

/**
 * OGP管理に関するユーティリティ関数
 */

export interface OgpMetaData {
  title: string;
  description: string;
  type: string;
  url: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  siteName: string;
}

/**
 * デフォルトのOGPメタデータを取得
 */
export const getDefaultOgpMeta = (url: string): OgpMetaData => ({
  title: '素敵な浴衣が完成しました！ - 浴衣の空',
  description: 'カスタマイズした浴衣のデザインが完成しました。あなただけの特別な浴衣をお楽しみください。',
  type: 'website',
  url,
  image: '/yukata.png',
  imageWidth: 1200,
  imageHeight: 630,
  siteName: '浴衣の空'
});

/**
 * OGP画像を生成
 */
export const generateOgpImage = (
  canvasRef: HTMLCanvasElement
): string => {
  try {
    const compositeCanvas = compositeYukataImage(canvasRef);
    if (compositeCanvas) {
      return compositeCanvas.toDataURL('image/png');
    }
  } catch (error) {
    console.error('OGP画像の生成に失敗しました:', error);
  }

  // フォールバック
  return '/yukata.png';
};

/**
 * SNS共有機能
 */
export const shareToSocial = (designState: any, origin: string) => {
  if (!designState) return;

  const shareUrl = `${origin}/complete?${new URLSearchParams(designState).toString()}`;
  const shareText = '素敵な浴衣が完成しました！ #浴衣の空';

  // クリップボードにコピー
  navigator.clipboard
    .writeText(shareUrl)
    .then(() => {
      alert('共有URLがクリップボードにコピーされました！');
    })
    .catch(() => {
      // フォールバック: プロンプトで表示
      prompt('この URLをコピーして共有してください:', shareUrl);
    });

  // SNS共有オプション
  if (navigator.share) {
    navigator
      .share({
        title: '浴衣の空',
        text: shareText,
        url: shareUrl
      })
      .catch(console.log);
  }
};
