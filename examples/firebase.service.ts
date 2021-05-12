import messaging from "@react-native-firebase/messaging";

class FirebaseService {
  async requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      await this.getFcmToken();
    }
    return authStatus;
  }

  async getFcmToken() {
    const token = await messaging().getToken();
    if (token) {
      console.log("Your Firebase Token is:", token);
      return token;
    } else {
      console.log("Failed", "No token received");
    }
  }
}

export const firebaseService = new FirebaseService();
