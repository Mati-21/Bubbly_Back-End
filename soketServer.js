export const socketHandler = (socket) => {
  // when user joins
  socket.on("user joins", (userId) => {
    socket.join(userId);
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
