# お城さんぽ ― 入口（城選び）

公開URL: https://32miya.github.io/oshiro/

## 新しい城を開城するとき（3ステップ）

1. **index.html の `CASTLES`** で、その城の `url:""` に公開URLを書く
   （例 `url:"https://32miya.github.io/32miya-matsuyama-castle/"`）。
   URLが空のあいだは「普請中」の札として表示される。
2. **札の絵**：スタート画面の3D絵を `img/<id>.webp`（468×800）に置き、`img:"img/<id>.webp"` を書く。
   無い場合は墨絵の天守シルエットで表示される。
3. **城側に戻るボタン**：城の index.html の `</body>` 直前に `castle-snippet.html` の中身をそのまま貼る。
   スタート画面の「散策をはじめる」の下と、メニューの末尾に「お城選びへ戻る」が出る。

Claude に「○○城のURLは △△」と伝えれば、上の3つ（スクリーンショット撮影も含む）をまとめて行える。

## 仕組みのメモ

- 戻り先は、入口ページが localStorage `oshiroSanpo.portal` に保存したURL（全城が 32miya.github.io の同一オリジンなので共有される）。
  保存が無いときは `https://32miya.github.io/oshiro/` に戻る。
- 御城印（登城済みの記録）は localStorage `oshiroSanpo.visited` に保存。端末ごと。
- 地図のピンは `lat` / `lon` から自動で配置。ラベル位置を調整したいときは `LABEL` に `[dx, dy, "start"|"middle"|"end"]` を足す。

## シリーズ共通の素材とルール
`common/README.md` を参照（共通素材の一覧、天守の窓から外が見える作り、戻るボタン）。
