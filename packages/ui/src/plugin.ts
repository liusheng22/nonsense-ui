import type { App, Plugin } from "vue";
import { NsContradictingCheckbox } from "./components/NsContradictingCheckbox";
import { NsGravityInput } from "./components/NsGravityInput";
import { NsSatisfactionRate } from "./components/NsSatisfactionRate";
import { NsMismatchedButton } from "./components/NsMismatchedButton";
import { NsNarcissisticRate } from "./components/NsNarcissisticRate";
import { NsReverseInput } from "./components/NsReverseInput";
import { NsRotaryDial } from "./components/NsRotaryDial";
import { NsUnclickableButton } from "./components/NsUnclickableButton";
import { NsCaptchaMaze } from "./components/NsCaptchaMaze";
import { NsUnclickableConfirmModal } from "./components/NsUnclickableConfirmModal";
import { NsUncatchableModal } from "./components/NsUncatchableModal";
import { NsRebirthModal } from "./components/NsRebirthModal";

const components = [
  NsUnclickableButton,
  NsReverseInput,
  NsContradictingCheckbox,
  NsSatisfactionRate,
  NsNarcissisticRate,
  NsMismatchedButton,
  NsRotaryDial,
  NsGravityInput,
  NsCaptchaMaze,
  NsUnclickableConfirmModal,
  NsUncatchableModal,
  NsRebirthModal
];

export const NonsenseUI: Plugin = {
  install(app: App) {
    for (const component of components) app.use(component);
  }
};

export default NonsenseUI;
