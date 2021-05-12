import {
  CommonActions,
  NavigationContainerRef,
} from "@react-navigation/native";
import { screenNames } from "../constants";

export type NavigationParams = {
  screen?: screenNames;
  params?: Record<string, unknown>;
  key?: string;
};
export abstract class Navigation {
  _navigator: React.RefObject<NavigationContainerRef> | undefined;

  // set navigator(ref: React.RefObject<NavigationContainerRef>)
  abstract navigate(targetRouteName: string, params?: NavigationParams): void;

  abstract back(): void;
}

class NavigatorService extends Navigation {
  _navigator: React.RefObject<NavigationContainerRef> | undefined;

  set navigator(ref: React.RefObject<NavigationContainerRef>) {
    this._navigator = ref;
  }

  navigate(targetRouteName: string, params?: Record<string, unknown>) {
    if (this._navigator) {
      this._navigator.current?.dispatch(
        CommonActions.navigate({
          name: targetRouteName,
          params,
        })
      );
    }
  }

  back() {
    if (this._navigator) {
      this._navigator.current?.dispatch(CommonActions.goBack());
    }
  }
}

export const navigatorService = new NavigatorService();
