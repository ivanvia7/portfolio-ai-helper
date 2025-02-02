import {
  locateButton,
  handleLoginTransition,
} from "../widget/dsWidgetBtnListeners";
import { callBkToAuth } from "../content/messagesToBk";

export function addLoginButtonListener() {
  const button = locateButton("loginButtonMain");

  if (button && !button.dataset.listenerAdded) {
    // console.log("created login listener");
    button.addEventListener("click", handleLoginButtonClick);
    button.dataset.listenerAdded = "true"; // Avoid duplicate listeners
  } else if (!button) {
    // console.log(`Cannot find a login button`);
  }
}

async function handleLoginButtonClick() {
  // console.log("Call BK to authenticate from the button listener");
  callBkToAuth().then((response) => {
    if (response) {
      // console.log("response from handleLoginButtonClick!!!!", response);
      handleLoginTransition();
    } else if (response === false) {
      // console.log("response is false so far");
    }
  });
}
