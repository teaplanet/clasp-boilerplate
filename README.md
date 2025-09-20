# clasp boilerplate

GASをTypeScriptで実装し、デプロイするためのボイラープレート。

## 開発環境構築

### 必要なパッケージのインストール

```bash
mise install node
pnpm install
```

## デプロイ

### 準備

初回のみ必要な準備。

#### Googleにログイン

```bash
clasp login
```

#### デプロイ先の指定

`.clasp-dev.json` の `scriptId` にデプロイ先のスクリプトIDを記述する。
必要に応じて `.clasp-prod.json` にも同様にスクリプトIDを記述する。

### デプロイ実行

```bash
./deploy
```

または

```bash
pnpm run deploy
```

### 開発環境の構成

| 項目     | 概要       |
| -------- | ---------- |
| 言語     | TypeScript |
| デプロイ | clasp      |

GASにデプロイするために `gasify.mjs` で GAS が理解できない構文を修正している。

**srcフォルダ**
TypeScriptで書いたソースコード。
`build` することで `dist` フォルダに JavaScript を生成する。

**distフォルダ**
GASにデプロイするファイル。
