# Rentr

Rentr is a mobile application built with React Native that allows users to rent items from others or list their own items for rent. It creates a peer-to-peer rental marketplace where users can find, rent, and list a variety of items across different categories.

## Features

### User Authentication
- **Login/Registration**: Secure user authentication system
- **Personal Profile**: Manage your personal information and profile settings

### Item Listings
- **Browse Items**: View available items for rent across multiple categories
- **Search Functionality**: Find specific items using the search feature
- **Categories**: Browse items by category (Electronics, Books, Clothing, Furniture, Tools, Sports, Toys, Vehicles, etc.)
- **Nearby Items**: Discover items available for rent near your location using geolocation
- **Favorites**: Save items to your favorites list for quick access

### Item Management
- **List Items**: Add your own items for rent with details such as:
  - Title and description
  - Multiple images
  - Price information (daily, weekly, monthly rates)
  - Availability dates
  - Location information
- **My Listings**: Manage your listed items (edit, delete, update availability)
- **Item Details**: View comprehensive information about items including availability calendar, location, and owner details

### Rental Management
- **My Rentals**: Track items you've rented from others
- **Rental Requests**: Process rental requests for your listed items
- **Availability Calendar**: Set and view availability dates for items

### Communication
- **Chat System**: Built-in messaging system to communicate with item owners or renters
- **Real-time Messaging**: Instant communication with other users using Socket.io

### User Experience
- **Theming**: Customize the app appearance with different theme options (light/dark mode)
- **Location Services**: Find items near you and see item locations on a map
- **Image Management**: Upload and view multiple images for each item

## Technology Stack

- **Frontend**: React Native (iOS & Android)
- **State Management**: Redux Toolkit
- **API Communication**: Axios, React Query
- **Navigation**: React Navigation
- **Real-time Features**: Socket.io
- **UI Components**: Custom components with theming support
- **Maps & Location**: React Native Maps, Geolocation services
- **Image Handling**: React Native Image Picker, Fast Image

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rentr.git
cd rentr
```

2. Install dependencies:
```bash
npm install
```

3. Start the Metro bundler:
```bash
npm start
```

4. Run the application:

For Android:
```bash
npm run android
```

For iOS:
```bash
npm run ios
```

## Additional Scripts

- `npm run gradle-clean`: Clean Android Gradle build
- `npm run android:install-release`: Build and install release APK on connected Android device

## Future Enhancements

- Payment integration for processing rental transactions
- Reviews and ratings system for users and items
- Enhanced filtering options for item search
- Push notifications for rental requests and messages
- Social media sharing of listings

## Contributing

Contributions to improve Rentr are welcome. Please feel free to submit a pull request or create an issue to discuss potential changes or additions.

# Getting Started

>**Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

