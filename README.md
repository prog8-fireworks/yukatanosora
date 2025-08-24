# ゆかたのそら

浴衣デザインアプリ

## クイックスタート

リポジトリをクローンして開発サーバを起動する手順です。

```bash
# リポジトリをクローン
git clone <リポジトリのURL>
cd yukatanosora

# 依存をインストール（npm の例）
npm install

# 開発サーバ起動
npm run dev

# ブラウザで自動オープンしたい場合（Vite に渡すフラグ）
npm run dev -- --open

# Ctrl + C でサーバ停止
```

## Git開発の流れ

- メインブランチ:
  - `main` — 本番デプロイ可能な安定ブランチ。直接 push はせず、PR 経由でのみマージします。
- 作業ブランチ:
  - `feat/<feature-name>` — 新機能や大きな変更を行うためのブランチ。`main` から分岐し、作業が完了したら PR を作成します。
  - ブランチ名は `feat/<機能名>` の形式で、機能の内容がわかるようにします。

```bash
# main ブランチに切り替え
git switch main

# 最新の状態に更新
git pull

# 新しいフィーチャーブランチを作る
git switch -c feat/my-feature

# 作業をコミットして push (vscodeでも可能)
git add .
git commit -m "新しいヘッダーコンポーネントを追加"
git push origin feat/my-feature

# GitHub で PR を作成
# discordでレビュー依頼
```

## ファイル構成

```bash
yukatanosora/
├── src/
│   ├── lib/             # 再利用可能なコンポーネントやユーティリティ
│   ├── routes/          # SvelteKit のルーティング
│   │   └── +page.svelte # ページ
│   ├── app.css          # アプリケーションのグローバルスタイル
│   └── app.html         # HTML テンプレート
├── static/              # 静的ファイル
├── package.json         # プロジェクト設定と依存関係
├── svelte.config.js     # SvelteKit の設定
├── vite.config.js       # Vite の設定
└── README.md            # このファイル
```

## 技術スタック

- Svelte/SvelteKit
- TypeScript
- Cloudflare Workers
