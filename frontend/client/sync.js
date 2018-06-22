import createChannel from "client/cable";

let callback, bound_this; // 後で関数を保持するための変数を宣言

const chat = createChannel("SyncChannel", {
    received(message) {
        if (callback) callback.call(bound_this, message);
    }
});

// メッセージを1件送信する: `perform`メソッドは、対応するRubyメソッド（chat_channel.rbで定義）を呼び出す
// ここがJavaScriptとRubyをつなぐ架け橋です！
let sayHello = () => {
    chat.perform("say_hello", {content: "yeah"});
};

const sendAudioNodes = (json) => {
    chat.perform("send_audio_node_json", {json: json});
};

// メッセージを1件受け取る: ChatChannelで何かを受信すると
// このコールバックが呼び出される
function setCallback(fn, _this) {
    callback = fn;
    bound_this = _this;
}


export {sayHello, setCallback, sendAudioNodes };