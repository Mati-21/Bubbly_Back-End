let onlineUsers = [];

export const socketHandler = (socket, io) => {
  // when user joins
  socket.on("user joins", (userId) => {
    socket.join(userId);

    if (!onlineUsers.some((user) => user.userId === userId)) {
      console.log(`user ${userId} joined`);
      onlineUsers.push({ userId: userId, socketId: socket.id });

      //send back online users
      io.emit("get-online-users", onlineUsers);
    }
  });

  // offline
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-online-users", onlineUsers);
  });

  // logout
  socket.on("logout", (userId) => {
    console.log("dilutional");
    onlineUsers = onlineUsers.filter(
      (u) => !(u.userId === userId && u.socketId === socket.id)
    );

    // notify frontend
    io.emit("get-online-users", onlineUsers);
  });

  //listen for the chat messages
  socket.on("sendMessage", (message) => {
    const users = message.chat.users;
    const senderId = message.sender._id;
    const receiver = users.filter((user) => {
      if (user._id !== senderId) {
        return user._id;
      }
    })[0]._id;

    socket.to(receiver).emit("receiveMessage", message);
  });
};
