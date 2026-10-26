// ===== サイト設定 =====
window.SITE_CONFIG = {
  siteName: "HTMMゲーム館",
  tagline: "ブラウザですぐ遊べる自作ゲーム集",
  githubUser: "32miya",

  // GitHub Pages を有効にしたリポジトリを自動で一覧に追加する（新しく見つかったものは「準備中」で表示）
  autoDiscover: true,
  // 自動追加しないリポジトリ名
  exclude: ["32miya.github.io", "GRQBGM", "game-portal"],

  // ゲームを新しいタブで開く（false にすると同じタブで開く）
  openInNewTab: true,

  // ===== プレイ回数・コメント・管理設定の保存先（Google Apps Script のウェブアプリURL）=====
  // 例: "https://script.google.com/macros/s/XXXXXXXX/exec"
  // 空のままだと「デモモード」（この端末の中だけで数える・管理画面は使えない）になります。
  apiUrl: ""
};
