import "dotenv/config";
import { Server as httpServer } from "http";
import { Server } from "socket.io";

export const WebSocket = (server: httpServer) => {
  const io = new Server(server, {
    cors: {
      origin: "*"
    }
  });

  const main = io.of("/");

  let msgList: string[] = [];

  main.on("connection", (socket) => {
    let name = "";

    console.log("new main connected:", socket.id);
    
    socket.on("disconnect", () => {
      console.log("main disconnect", socket.id);
    });

    socket.on("join_chat", (data) => {
      name = data.name;
      socket.join("chat");
      socket.emit("before", msgList.map(v => "<p>"+v.replace(/\</g,"&lt;").replace(/\>/g,"&gt;")+"</p>"));
    });

    socket.on("chat", (data) => {
      if (name) {
        let text = `<${name}> ${data.chat}`;
        console.log(text);
        msgList.push(text);
        main.to("chat").emit("chat", `<p>${text.replace(/\</g,"&lt;").replace(/\>/g,"&gt;")}</p>`);
      } else {
        socket.emit("error", "닉네임을 먼저 설정해주세요.");
      }
    })
  });
}