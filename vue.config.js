module.exports = {
    devServer: {
        port: 3000,
        // localhostでvueからexpressにAPIリクエストを送信する為の設定
        proxy: 'http://localhost:8080'
    },
}