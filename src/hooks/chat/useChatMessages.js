import {useState, useEffect} from 'react';
import {chatApi} from '../../apis/chat';
import io from 'socket.io-client';
import {getBaseUrl} from '../../apis/constants';

const useChatMessages = (roomId, token, user, item) => {
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [media, setMedia] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Initialize socket connection
  useEffect(() => {
    if (!token) {
      return;
    }
    setLoading(true);
    let newSocket;
    try {
      const baseUrl = getBaseUrl();
      newSocket = io(baseUrl, {
        auth: {
          token: token,
        },
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket');
        newSocket.emit('join_room', roomId);
      });

      setSocket(newSocket);
    } catch (error) {
      console.log('error in socket', error);
    } finally {
      setLoading(false);
    }

    // Cleanup on unmount
    return () => {
      if (newSocket) {
        newSocket.emit('leave_room', roomId);
        newSocket.disconnect();
      }
    };
  }, [roomId, token]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.on('new_message', newMessage => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('new_message');
    };
  }, [socket]);

  // Effect to handle initial message when coming from Contact Owner
  useEffect(() => {
    const sendInitialMessage = async () => {
      if (item && !loading && socket) {
        try {
          let imageUrls = item.images || [];

          const content = `I am interested in this item for rent. Can we connect to discuss the details?
          Item Details:
          • Name: ${item.name}
          • Price: ${item.price}
          • Description: ${item.description}`;

          let newMessage = {
            content: content,
            senderId: user.id,
            chatRoomId: roomId,
            media: imageUrls.length > 0 ? [imageUrls[0]] : [],
            createdAt: new Date(),
            updatedAt: new Date(),
            sender: {
              id: user.id,
            },
          };

          socket.emit('send_message', newMessage);

          await chatApi.sendMessage({
            content: content,
            chatRoomId: roomId,
            media: imageUrls,
          });
        } catch (error) {
          console.log('error sending initial message', error);
        }
      }
    };

    if (item) {
      sendInitialMessage();
    }
  }, [item, loading, roomId, user?.id, socket]);

  const sendMessage = async () => {
    setLoadingMessage(true);
    let tempMedia = media;
    let tempMessage = message;

    try {
      if (tempMessage.trim().length > 0 || tempMedia.length > 0) {
        // Emit message to socket server
        let imageUrls = [];
        if (tempMedia.length > 0) {
          const mediaData = new FormData();
          tempMedia.forEach(({uri, type, fileName}) => {
            mediaData.append('images', {
              uri: uri,
              type: type,
              name: fileName,
            });
          });
          imageUrls = await chatApi.mediaUpload(mediaData);
        }

        let newMessage = {
          content: tempMessage,
          senderId: user.id,
          chatRoomId: roomId,
          media: imageUrls,
          createdAt: new Date(),
          updatedAt: new Date(),
          sender: {
            id: user.id,
          },
        };

        socket.emit('send_message', newMessage);

        setMedia([]);
        setMessage('');
        await chatApi.sendMessage({
          content: tempMessage,
          chatRoomId: roomId,
          media: imageUrls,
        });
      }
    } catch (error) {
      console.log('error in send message', error);
    } finally {
      setLoadingMessage(false);
    }
  };

  const fetchMessages = async (pageNum = 1, shouldPrepend = false) => {
    if (!hasMore && pageNum > 1) {
      return;
    }
    setLoading(true);
    try {
      const messagesData = await chatApi.getChatMessages(roomId, 5, pageNum);
      if (messagesData.messages.length < 5) {
        setHasMore(false);
      }
      setMessages(prevMessages =>
        shouldPrepend
          ? [...messagesData.messages, ...prevMessages] // Prepend older messages
          : messagesData.messages,
      );
      setPage(pageNum);
    } catch (error) {
      console.log('error in fetch messages', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMessages(1, false);
  }, [roomId]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchMessages(page + 1, true); // Set to true to prepend messages
    }
  };

  const addMedia = newMedia => {
    setMedia(prevMedia => [...prevMedia, newMedia]);
  };

  const removeMedia = index => {
    setMedia(prevMedia => prevMedia.filter((_, i) => i !== index));
  };

  return {
    loading,
    loadingMessage,
    message,
    setMessage,
    messages,
    media,
    addMedia,
    removeMedia,
    sendMessage,
    fetchMessages,
    handleLoadMore,
    hasMore,
  };
};

export default useChatMessages;
