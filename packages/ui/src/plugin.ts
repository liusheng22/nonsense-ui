import type { App, Plugin } from "vue";
import { NsContradictingCheckbox } from "./components/NsContradictingCheckbox";
import { NsGravityInput } from "./components/NsGravityInput";
import { NsSatisfactionRate } from "./components/NsSatisfactionRate";
import { NsMismatchedButton } from "./components/NsMismatchedButton";
import { NsNarcissisticRate } from "./components/NsNarcissisticRate";
import { NsReverseInput } from "./components/NsReverseInput";
import { NsRotaryDial } from "./components/NsRotaryDial";
import { NsUnclickableButton } from "./components/NsUnclickableButton";

const components = [
  NsUnclickableButton,
  NsReverseInput,
  NsContradictingCheckbox,
  NsSatisfactionRate,
  NsNarcissisticRate,
  NsMismatchedButton,
  NsRotaryDial,
  NsGravityInput
];

export const NonsenseUI: Plugin = {
  install(app: App) {
    for (const component of components) app.use(component);
  }
};

export default NonsenseUI;
