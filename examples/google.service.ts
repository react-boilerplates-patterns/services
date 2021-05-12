import { GoogleSignin, User } from "@react-native-community/google-signin";
import { ReactNativeFirebase } from "@react-native-firebase/app";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";

const GoogleSignInOptions = {
  scopes: ["email"],
  webClientId: "id",
  offlineAccess: true,
};

class GoogleAuthService {
  _firebaseAuth:
    | ReactNativeFirebase.FirebaseModuleWithStaticsAndApp<
        FirebaseAuthTypes.Module,
        FirebaseAuthTypes.Statics
      >
    | undefined;

  set firebaseAuth(
    auth: ReactNativeFirebase.FirebaseModuleWithStaticsAndApp<
      FirebaseAuthTypes.Module,
      FirebaseAuthTypes.Statics
    >
  ) {
    this._firebaseAuth = auth;
  }

  async configure() {
    await GoogleSignin.configure({ ...GoogleSignInOptions });
  }

  async signIn(): Promise<User | void> {
    if (this._firebaseAuth) {
      await GoogleSignin.hasPlayServices();

      const user = await GoogleSignin.signIn();
      const credential = this._firebaseAuth.GoogleAuthProvider.credential(
        user.idToken
      );
      await this._firebaseAuth().signInWithCredential(credential);
      return user;
    } else {
      console.log("FIREBASE DONT RECEIVE SIGNIN");
    }
  }

  async signOut() {
    const isSignedIn = await GoogleSignin.isSignedIn();

    if (isSignedIn) {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    }
    return;
  }
}

export const googleAuthService = new GoogleAuthService();
