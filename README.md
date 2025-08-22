# ゆかたのそら

このリポジトリは SvelteKit（Svelte + Vite）で構成されたフロントエンドプロジェクトです。
ここでは、プロジェクトに参加する開発者がローカルで環境を立ち上げ、開発を始めるための手順をまとめています。

## 前提条件

- Node.js 18 以上を推奨（package.json の依存から推定しています）。
- npm

## クイックスタート

リポジトリをクローンして開発サーバを起動する最短手順です。

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
```

## 主要スクリプト

package.json に定義された主要スクリプトと目的です。

- `npm run dev` — 開発サーバ（ホットリロード付き）を起動します。
- `npm run build` — 本番用ビルドを作成します。
- `npm run preview` — build 出力をローカルで軽くプレビューします。
- `npm run check` — `svelte-check` による型/診断チェックを行います（TypeScript を利用している場合に有用）。
- `npm run check:watch` — 型チェックをウォッチモードで実行します。

例:

```bash
npm run build
npm run preview
```

## 開発フローの簡単な契約（inputs/outputs）

- 入力: ソースの編集（`src/` 以下）
- 出力: 開発サーバの即時反映 / `build` 実行後に `build` ディレクトリ
- エラー: 型エラーやビルド失敗は CI でブロックします（ローカルで `npm run check` を推奨）

## VS Code 推奨設定

- 推奨拡張: `Svelte for VS Code`（svelte.vscode-svelte）
- workspace に `.vscode/settings.json` を追加している場合はそれを参照してください。

## よくあるトラブルと対処

- Node のバージョンが低いとビルドや依存の解決で失敗します。`node -v` で確認し、必要なら nvm や Volta で切り替えてください。
- 依存インストールで失敗した場合は `node_modules` とロックファイル（`package-lock.json` / `pnpm-lock.yaml` / `yarn.lock`）を削除して再インストールを試してください。

## ブランチ運用 (開発時のルール)

チームでの共同開発をスムーズにするため、シンプルなブランチ規約と PR フローを定めます。

- メインブランチ:
  - `main` — 本番デプロイ可能な安定ブランチ。直接 push はせず、PR 経由でのみマージします。
- フィーチャーブランチ:
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
git commit -m "feat: 新しいヘッダーコンポーネントを追加"
git push origin feat/my-feature

# GitHub で PR を作成
# discordでレビュー依頼
```
