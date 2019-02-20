import { Navigation } from "react-native-navigation";
import StartScreen from "./src/screens/Start/Start";

console.disableYellowBox = true;

Navigation.registerComponent("StartScreen", () => StartScreen);

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions({
    statusBar: {
      hideWithTopBar: false,
      blur: true
    },
    popGesture: true,
    topBar: {
      visible: false,
      hideOnScroll: false,
      background: {
        color: "#01396F"
      },
      noBorder: true,
      animate: false
    },
    sideMenu: {
      openGestureMode: "bezel", // 'entireScreen' | 'bezel'
      left: {
        shouldStretchDrawer: false, // defaults to true, when false sideMenu contents not stretched when opened past the width
        animationVelocity: 1000, // defaults to 840, high number is a faster sideMenu open/close animation
        animationType: "slide" // defaults to none if not provided, options are 'parallax', 'door', 'slide', or 'slide-and-scale'
      }
    },
    bottomTabs: {
      visible: false,
      drawBehind: true,
      animate: false
    }
  });

  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [
          {
            stack: {
              children: [
                {
                  component: {
                    id: "Home",
                    name: "StartScreen"
                  }
                }
              ],
              options: {
                bottomTab: {
                  fontSize: 10,
                  text: "Loading menu..."
                }
              }
            }
          }
        ]
      }
    }
  });
});
