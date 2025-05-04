const user = {
    "id": "6813aaff940e8c4ef2ff0b36",
    "email": "test1@rentr.com",
    "password": "$2a$10$P.lC/9xK0otWHXcLe6Ofo.3PXyVj4663ZPv5y1uPMpFOenvxDf2g6",
    "firstName": "test1",
    "lastName": "test1",
    "phoneNumber": null,
    "address": null,
    "createdAt": "2025-05-01T17:10:23.205Z",
    "updatedAt": "2025-05-01T20:26:07.711Z",
    "profileImage": null,
    "theme": {
      "lightTheme": {
        "colors": {
          "background": "#FFFFFF",
          "surface": "#F5F5F5",
          "primary": "red",
          "secondary": "#ABABAB",
          "error": "blue",
          "text": {
            "primary": "#1A1A1A",
            "secondary": "#666666"
          }
        },
        "fonts": {
          "regular": "Roboto-Regular",
          "medium": "Roboto-Medium",
          "bold": "Roboto-Bold"
        }
      },
      "darkTheme": {
        "isDark": true,
        "colors": {
          "background": "#1e1e1e",
          "surface": "black",
          "primary": "#008eff",
          "secondary": "#ABABAB",
          "error": "blue",
          "text": {
            "primary": "#FFFFFF",
            "secondary": "#ABABAB"
          }
        },
        "fonts": {
          "regular": "Roboto-Regular",
          "medium": "Roboto-Medium",
          "bold": "Roboto-Bold"
        }
      }
  },
};


const chatRoom = {
    "id": "6813b1a0940e8c4ef2ff0b3b",
    "createdAt": "2025-05-01T17:38:40.801Z",
    "updatedAt": "2025-05-01T17:38:40.801Z",
    "participants": [
        {
            "id": "6813b1a0940e8c4ef2ff0b3c",
            "userId": "6813aaff940e8c4ef2ff0b36",
            "chatRoomId": "6813b1a0940e8c4ef2ff0b3b",
            "joinedAt": "2025-05-01T17:38:40.801Z",
            "user": {
                "id": "6813aaff940e8c4ef2ff0b36",
                "firstName": "test1",
                "lastName": "test1",
                "profileImage": null
            }
        },
        {
            "id": "6813b1a0940e8c4ef2ff0b3d",
            "userId": "68137eedbec131eb6d7f2d90",
            "chatRoomId": "6813b1a0940e8c4ef2ff0b3b",
            "joinedAt": "2025-05-01T17:38:40.801Z",
            "user": {
                "id": "68137eedbec131eb6d7f2d90",
                "firstName": "test",
                "lastName": "test",
                "profileImage": "https://drive.google.com/uc?export=view&id=1TH26oLmjCgiMsWRBKBDovWLyLeV3n3Ou"
            }
        }
    ],
    "messages": [
        {
            "id": "681624c6595592b1d61f5c23",
            "content": "hi",
            "senderId": "6813aaff940e8c4ef2ff0b36",
            "chatRoomId": "6813b1a0940e8c4ef2ff0b3b",
            "createdAt": "2025-05-03T14:14:30.781Z",
            "updatedAt": "2025-05-03T14:14:30.781Z",
            "media": [],
            "metadata": {},
            "sender": {
                "id": "6813aaff940e8c4ef2ff0b36",
                "firstName": "test1",
                "lastName": "test1"
            }
        }
    ]
}

const item = {
    "id": "6813d643d1e8d31a0de8831a",
    "name": "test",
    "description": "test",
    "price": 22,
    "available": true,
    "rentalPeriod": "daily",
    "dateRange": {
        "startDate": "2025-05-01",
        "endDate": "2025-05-15"
    },
    "ownerId": "68137eedbec131eb6d7f2d90",
    "createdAt": "2025-05-01T20:14:59.458Z",
    "updatedAt": "2025-05-01T20:14:59.458Z",
    "images": [
        {
            "uri": "https://drive.google.com/uc?export=view&id=1PLBdgQ_5TTWrSy00h5JYBVD8ETX5ygVF",
            "name": "68137eedbec131eb6d7f2d90-item-1746130496209-test_image_0.jpg",
            "type": "image/jpeg"
        }
    ],
    "isFavorite": false,
    "category": "Books",
    "isRented": false
}