import { NavigationProp } from '@react-navigation/native';


export type TUser = {
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

export type TMedia = {
  id: string;
  uri: string;
  name: string;
  type: string;
};

export type TMessage = {
  id: string;
  content: string;
  senderId: string;
  chatRoomId: string;
  createdAt: string;
  updatedAt: string;
  sender: TUser;
  media: TMedia[];
  metadata: any;
};

export type TMessageProps = {
    item: TMessage;
  theme: any;
  user: TUser;
  setSelectedImages: (images: TMedia[]) => void;
  setShowImageCarousel: (show: boolean) => void;
  handleMessageLink: (link: any) => void;
};

export type TDateRange = {
  startDate: string;
  endDate: string;
};

export type TParticipant = {
  id: string;
  userId: string;
  chatRoomId: string;
  joinedAt: string;
  user: TUser;
};

export type TChat = {
  id: string;
  createdAt: string;
  updatedAt: string;
  participants: TParticipant[];
  messages: TMessage[];
};

export type TLocation = {
  latitude: number;
  longitude: number;
  address?: string;
};

export type TItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  rentalPeriod: string;
  dateRange: TDateRange;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
  images: TMedia[];
  isFavourite?: boolean;
  category: string;
  isRented?: boolean;
  location?: TLocation;
};

export type TListItemProps = {
  item: TItem;
  theme: any;
  navigation: NavigationProp<any>;
  horizontal?: boolean;
  showFavorite?: boolean;
};

export type TRootStackParamList = {
  ItemDetails: { item: TItem };
};


export type TFormData = {
  name: string;
  description: string;
  price: string;
  rentalPeriod: string;
  dateRange: TDateRange;
  category: string;
  location: TLocation;
  images: TMedia[];
};
