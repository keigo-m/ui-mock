import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-2xl w-full">
        <div>
            <h1 className="text-4xl font-bold mb-2">システム UI 実装研修: データテーブル</h1>
            <p className="text-lg text-gray-600">
            基本的な HTML テーブルから始まり、プロフェッショナルなシステム UI コンポーネントへ進化させていくステップバイステップの研修です。
            </p>
        </div>

        <nav className="flex flex-col gap-3 w-full">
          <Link href="/step1" className="block group">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
               <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">Step 1: 基本的な HTML テーブル</h2>
               <p className="text-sm text-gray-500 mt-1">最も原始的なアプローチ。機能はなく、パフォーマンスも考慮されていません。</p>
            </div>
          </Link>
          
          <Link href="/step2" className="block group">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-orange-400"></div>
               <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">Step 2: React コンポーネント化</h2>
               <p className="text-sm text-gray-500 mt-1">ロジックのコンポーネント化。コードはきれいになりますが、複雑な状態管理はまだ困難です。</p>
            </div>
          </Link>

          <Link href="/step3" className="block group">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
               <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">Step 3: TanStack Table の導入</h2>
               <p className="text-sm text-gray-500 mt-1"><strong>Headless UI</strong> の導入。データロジックとビュー（見た目）を分離します。</p>
            </div>
          </Link>

          <Link href="/step4" className="block group">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-green-400"></div>
               <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">Step 4: インタラクティブ機能</h2>
               <p className="text-sm text-gray-500 mt-1">Hooks を使ったソート、フィルター、ページネーションの実装。</p>
            </div>
          </Link>

          <Link href="/step5" className="block group">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
               <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">Step 5: 高度な UI (完成形)</h2>
               <p className="text-sm text-gray-500 mt-1">ヘッダーや列の固定 (Sticky)、プロフェッショナルなスタイリング、複雑なレイアウト。</p>
            </div>
          </Link>

          <Link href="/step6" className="block group">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-teal-500"></div>
               <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">Step 6: 列ごとのフィルター</h2>
               <p className="text-sm text-gray-500 mt-1">各カラムに入力欄を設置。より高度なインタラクション。</p>
            </div>
          </Link>

          <Link href="/step7" className="block group">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
               <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">Step 7: CSV エクスポート</h2>
               <p className="text-sm text-gray-500 mt-1">クライアントサイドでの CSV 生成とダウンロード。</p>
            </div>
          </Link>

          <Link href="/step8" className="block group">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
               <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">Step 8: 行アクション</h2>
               <p className="text-sm text-gray-500 mt-1">編集、削除、複製。ミュータブルな状態管理。</p>
            </div>
          </Link>

          <Link href="/step9" className="block group">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-violet-500"></div>
               <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">Step 9: スタイリング実験室</h2>
               <p className="text-sm text-gray-500 mt-1">Tailwind CSS の効果をインタラクティブに学習。</p>
            </div>
          </Link>

          <Link href="/step10" className="block group">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all bg-white relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
               <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">Step 10: テーマ切り替え</h2>
               <p className="text-sm text-gray-500 mt-1">CSS Variables を使ったカラーテーマの実装。</p>
               <span className="absolute top-4 right-4 bg-cyan-100 text-cyan-700 text-xs px-2 py-1 rounded-full font-bold">NEW</span>
            </div>
          </Link>
        </nav>

        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 mt-12 pb-2 border-b">汎用コンポーネント (Common Components)</h2>
        <nav className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            
            <Link href="/components/forms" className="block group">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all bg-white">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600">フォーム</h3>
                    <p className="text-xs text-gray-500 mt-1">バリデーションと入力</p>
                </div>
            </Link>

            <Link href="/components/modals" className="block group">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all bg-white">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600">モーダル</h3>
                    <p className="text-xs text-gray-500 mt-1">ダイアログとオーバーレイ</p>
                </div>
            </Link>

            <Link href="/components/toasts" className="block group">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all bg-white">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600">トースト</h3>
                    <p className="text-xs text-gray-500 mt-1">一時的な通知</p>
                </div>
            </Link>

            <Link href="/components/tabs" className="block group">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all bg-white">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600">タブ</h3>
                    <p className="text-xs text-gray-500 mt-1">コンテンツの切り替え</p>
                </div>
            </Link>

            <Link href="/components/layouts" className="block group">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all bg-white">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600">レイアウト</h3>
                    <p className="text-xs text-gray-500 mt-1">ダッシュボード構造</p>
                </div>
            </Link>

            <Link href="/components/complex-form" className="block group">
                <div className="p-4 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-sm transition-all bg-white">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600">複合フォーム</h3>
                    <p className="text-xs text-gray-500 mt-1">長いページの UX 改善</p>
                </div>
            </Link>

        </nav>
      </main>
    </div>
  );
}
