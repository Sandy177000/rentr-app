import { NavigationProp } from '@react-navigation/native';


export type User = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  profileImage: string;
  theme: any;
};

export type Media = {
  id: string;
  uri: string;
  name: string;
  type: string;
};

export type Message = {
  id: string;
  content: string;
  senderId: string;
  chatRoomId: string;
  createdAt: string;
  updatedAt: string;
  sender: User;
  media: Media[];
  metadata: any;
};

export type MessageProps = {
  item: Message;
  theme: any;
  user: User;
  setSelectedImages: (images: Media[]) => void;
  setShowImageCarousel: (show: boolean) => void;
  handleMessageLink: (link: any) => void;
};

export type DateRange = {
  startDate: string;
  endDate: string;
};

export type Participant = {
  id: string;
  userId: string;
  chatRoomId: string;
  joinedAt: string;
  user: User;
};

export type Chat = {
  id: string;
  createdAt: string;
  updatedAt: string;
  participants: Participant[];
  messages: Message[];
};

export type Location = {
  latitude: number;
  longitude: number;
  address?: string;
};

export type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  rentalPeriod: string;
  dateRange: DateRange;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  images: Media[];
  isFavourite: boolean;
  category: string;
  isRented: boolean;
  location: Location;
};

export type ListItemProps = {
    item: Item;
    theme: any;
    navigation: NavigationProp<any>;
    horizontal?: boolean;
    showFavorite?: boolean;
};
