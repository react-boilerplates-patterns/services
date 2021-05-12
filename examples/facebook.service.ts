import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
  LoginResult,
} from "react-native-fbsdk";
import { store } from "../store";

class FacebookAuthService {
  async loginWithFacebook(): Promise<any | undefined> {
    await LoginManager.setLoginBehavior("native_with_fallback");

    const loggedWithPermission = await LoginManager.logInWithPermissions([
      "email",
    ]);
    if (loggedWithPermission.isCancelled) {
      console.log("Login cancelled");
    } else {
      console.log(
        "Login success with permissions: " +
          loggedWithPermission?.grantedPermissions?.toString()
      );
      const getAccessToken: AccessToken | null = await AccessToken.getCurrentAccessToken();

      return getAccessToken?.accessToken.toString();
    }
  }

  async signInToken(
    error: any,
    result: LoginResult
  ): Promise<string | undefined> {
    const getAccessToken: AccessToken | null = await AccessToken.getCurrentAccessToken();

    if (getAccessToken) {
      return getAccessToken.accessToken.toString();
    }
  }

  async signOut() {
    const state = store.getState();
    const accessToken = state.requests.auth.facebookSignIn.facebookToken;

    if (accessToken) {
      const logout = new GraphRequest(
        "me/permissions/",
        {
          accessToken,
          httpMethod: "DELETE",
        },
        (error, result) => {
          if (error) {
            console.log("Error fetching data: " + error.toString());
          } else {
            LoginManager.logOut();
          }
        }
      );
      new GraphRequestManager().addRequest(logout).start();
    }
    return;
  }
}

export const facebookAuthService = new FacebookAuthService();
