// ===== サイト設定 =====
// ここを書き換えるだけでサイト名などを変えられます。
window.SITE_CONFIG = {
  siteName: "HTMMゲーム館",
  tagline: "ブラウザですぐ遊べる自作ゲーム集",
  githubUser: "32miya",

  // GitHub Pages を有効にしたリポジトリを自動で一覧に追加する（games.json に無いものは「開発中・未分類」で表示）
  autoDiscover: true,
  // 自動追加しないリポジトリ名
  exclude: ["32miya.github.io", "GRQBGM", "game-portal"],

  // ゲームを新しいタブで開く（false にすると同じタブで開く）
  openInNewTab: true,

  // ===== 起動回数・コメントの保存先（Firebase / 無料プラン）=====
  // README.md の手順で取得した値を貼り付けてください。
  // 空のままだと「デモモード」になり、回数とコメントはこのブラウザの中だけに保存されます。
  firebase: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    appId: ""
  }
};
