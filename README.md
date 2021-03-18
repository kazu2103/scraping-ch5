# scraping-ch5
5chのスレッドは性質上、1,000件のレスしか表示できず、同じトピックに対して複数のスレッドが作成されていることがあります。
情報収集がしづらいので、5chのスレッドをまとめてスクレイピングし、一つのテーブルに表示するSpringBootアプリケーションを作成しました。
テーブルには「[w2ui grid](http://w2ui.com/web/docs/1.5/grid)」を使っています。
![画像](https://github.com/kazu2103/scraping-ch5/blob/11c7bd8e968ac8417269dcb053fcb39c0afb9674/scraping-ch5.JPG)

アンカーにマウスホバーしたりクリックしたりすることで、参照先・参照元を追うこともできます。
