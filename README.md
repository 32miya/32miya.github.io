# HTMMゲーム館

GitHub に置いた自作ゲームを一覧で紹介し、画像をタップするとそのままゲームが起動するポータルサイトです。
GitHub Pages（無料）で公開し、起動回数とコメントは Firebase（無料プラン）に保存します。

## できること
- ゲーム画面のサムネイル・簡単な説明・ジャンル・開発状況（開発完了／開発中）・NEW表示
- 画像をタップ → そのゲームが新しいタブで起動（起動回数を自動カウント）
- 起動回数ランキング（上位3本に王冠）・サイト全体の総プレイ数
- ゲームごとのコメント欄（ログイン不要、300文字まで）
- 並び替え：更新が新しい順／起動回数／コメント数／名前順／ジャンル順
- ジャンル絞り込み・開発状況の絞り込み・キーワード検索
- ゲームごとの共有URL（`…/#g=rokuro` で詳細が開く）
- GitHub Pages を有効にした新しいリポジトリは自動で一覧に追加（「開発中・未分類」で表示）

## ファイル構成
| ファイル | 役割 |
|---|---|
| `index.html` | サイト本体 |
| `games.json` | ゲーム一覧（タイトル・説明・ジャンル・状態・画像） |
| `config.js` | サイト名・Firebase設定 |
| `thumbs/` | ゲーム画面の画像 |
| `firestore.rules` | Firebase のセキュリティルール |

---

## 1. GitHub Pages で公開する（約5分）

**おすすめ：リポジトリ名を `32miya.github.io` にする**と、サイトのURLが `https://32miya.github.io/` になります。
（ほかの名前、たとえば `game-portal` にした場合は `https://32miya.github.io/game-portal/` になります）

1. GitHub で新しいリポジトリ `32miya.github.io` を作成（Public）
2. このフォルダの中身を全部アップロード（「Add file」→「Upload files」にドラッグでもOK）
3. リポジトリの「Settings」→「Pages」→ Source を「Deploy from a branch」、Branch を `main` / `/(root)` にして Save
4. 1〜2分後に `https://32miya.github.io/` を開くと表示されます

※ この時点では「デモモード」で、起動回数とコメントは見た人のブラウザの中だけに保存されます。

## 2. 起動回数とコメントをみんなで共有する（Firebase・無料）

1. https://console.firebase.google.com/ を開き、Googleアカウントでログイン
2. 「プロジェクトを作成」→ 名前は `32miya-games` など（Googleアナリティクスはオフで可）
3. 左メニュー「構築」→「Firestore Database」→「データベースを作成」
   - ロケーション：`asia-northeast1（東京）`
   - 「本番環境モード」で開始
4. Firestore の「ルール」タブを開き、このフォルダの `firestore.rules` の中身を全部貼り付けて「公開」
5. プロジェクトの概要（歯車）→「プロジェクトの設定」→ 下の「マイアプリ」で **</>（ウェブ）** を選んでアプリを登録
6. 表示された `firebaseConfig` のうち `apiKey` `authDomain` `projectId` `appId` の4つを `config.js` に貼り付け
7. `config.js` を GitHub にアップロードし直せば完了（デモモードの表示が消えます）

> apiKey は公開しても問題ない値です（書き込みできる内容は `firestore.rules` で「+1するだけ」「300文字以内のコメントを追加するだけ」に制限しています）。

### コメントの削除（荒らし対策）
Firebase コンソール →「Firestore Database」→ `comments` から該当のコメントを削除してください。
削除した分のコメント数は `stats` → ゲームID → `comments` の数字を手で直せます。

### 無料枠の目安
Firestore の無料枠は 1日あたり読み取り5万回・書き込み2万回。個人のゲームサイトなら十分です。

---

## ゲームを追加・編集するには

`games.json` に1ブロック追加するだけです。

```json
{
  "id": "rokuro",
  "title": "ろくろ",
  "genres": ["シミュレーション"],
  "status": "dev",
  "desc": "回る粘土を指で形づくる陶芸ゲーム。",
  "thumb": "thumbs/rokuro.webp",
  "emoji": "🏺",
  "updated": "2026-10-23"
}
```

- `id` … GitHub のリポジトリ名（URLは自動で `https://32miya.github.io/<id>/` になります）
- `status` … `done`＝開発完了 ／ `dev`＝開発中
- `genres` … 複数指定OK。新しいジャンル名を書けば絞り込みボタンも自動で増えます
- `thumb` … 画像のパス。省略すると `emoji` とタイトルのカードになります
- `url` … GitHub Pages 以外の場所にあるゲームのときだけ指定
- `hidden` … `true` にすると一覧に出しません
- `updated` … GitHub から最終更新日を取れなかったときの予備

サムネイル画像は縦長（4:5くらい）がきれいに収まります。ゲーム画面をスマホでスクリーンショットして `thumbs/` に入れてください。

自動追加したくないリポジトリは `config.js` の `exclude` に名前を書いてください。
