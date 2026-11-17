# 世界さんぽ ― 入口（旅先えらび）

公開URL: https://32miya.github.io/sekai/

お城さんぽ（日本の城・/oshiro/）の姉妹編。世界の名所と伝説の都を、同じ3D散策システムで歩くシリーズの入口。

## 新しい名所を公開するとき（3ステップ）

1. **index.html の `PLACES`** に1件足す（または準備中の札の `url:""` に公開URLを書く）。
   例 `url:"https://32miya.github.io/versailles-sanpo/"`。URLが空のあいだは「準備中」の札として表示される。
   - `seal`：その名所が塔・最上階などで localStorage に書く印のキー（例 `"versailles_seal"`、値は `Date.now()`）。札に査証印として出る
   - `fuda`：見どころ札のキーと総数（例 `{key:"versailles_fuda", total:20}`、値は `{名所id:1,...}`）
   - `lat` / `lon`：古地図の印の位置。地図の範囲は全名所が入るように自動で広がる
   - `year`（紀元前はマイナス）と `jp`（そのころの日本）：時の回廊（年表）に使う
2. **札の絵**：スタート画面の3D絵を `img/<id>.webp`（468×800）に置き、`img:"img/<id>.webp"` を書く。
   無い場合は `sil`（palace / spire / temple）の銅版画風シルエットで表示される。
3. **名所側に戻るボタン**：名所の index.html の `</body>` 直前に `place-snippet.html` の中身をそのまま貼る。
   スタート画面の「歩く」ボタンの下と、メニューの末尾に「世界さんぽへ戻る」が出る（`#goBtn` と `#menu` があればよい）。

Claude に「○○のURLは △△」と伝えれば、上の3つ（スクリーンショット撮影も含む）をまとめて行える。

## 仕組みのメモ

- 戻り先は、入口ページが localStorage `sekaiSanpo.portal` に保存したURL（全名所が 32miya.github.io の同一オリジンなので共有される）。
  保存が無いときは `https://32miya.github.io/sekai/` に戻る。
- 査証印・見どころ札は各名所が自分のキー（`atlantis_seal` など）で保存したものを入口が読むだけ。端末ごと。
- 地図の名札の位置は `LABEL` に `[dx, dy, "start"|"middle"|"end"]`（画面幅の1/100単位）で調整。海の古名は `SEAS`。
- 陸地の形は `land.js`（Natural Earth 1:110m）。
