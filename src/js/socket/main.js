var socket = io.connect("http://localhost:3333");

$("#name").focus();

socket.on("error", (data) => {
  alert(data);
  $(".main").css("display", "block");
  $(".chat").css("display", "none");
});

socket.on("before", (data) => {
  for (let text of data) {
    $("#message").append(text);
  }
});

socket.on("chat", (data) => {
  console.log("메세지 확인:", data);
  $("#message").append(data);
});

function nameSend(event) {
  if (event.keyCode === 13) {
    let $name = $("#name");
    if ($name.val()) {
      socket.emit("join_chat", { name: $name.val() });
      $(".main").css("display", "none");
      $(".chat").css("display", "block");
      $("#chat").focus();
    } else {
      alert("name 입력");
    }
  }
}

function chatSend(event) {
  if (event.keyCode === 13) {
    let $chat = $("#chat");
    if ($chat.val()) {
      socket.emit("chat", { chat: $chat.val() });
      $chat.val("");
    }
  }
}