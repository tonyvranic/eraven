import { queryFn } from "../../../utils/queryFn";

export default function Init() {

  const sections = document.querySelectorAll('[data-recipe-left-column]');

  sections.forEach(section => {
    // Config
    const revertButtonActiveClass = 'active';

    // The first element is here since I cannot 
    // catch the disabled of the label-icon-button directly at the moment...
    const servingSizeTopWrapSelector = '.serving-size-label-wrap';
    const servingSizeDisplaySelector = '[data-serving-size-display]';

    const servingSizeInputSelector = '[data-serving-size-input]';
    const perServingInputSelector = '[data-per-serving-input]';
    const totalServingInputSelector = '[data-total-serving-input]';

    const servingSizeLockButtonSelector = '[data-serving-size-lock-button]';
    const perServingLockButtonSelector = '[data-per-serving-lock-button]';
    const totalServingLockButtonSelector = '[data-total-serving-lock-button]';

    const caloriesDisplaySelector = '[data-calories-display]';
    const carbsDisplaySelector = '[data-carbs-display]';
    const sugarsDisplaySelector = '[data-sugars-display]';
    const fatsDisplaySelector = '[data-fats-display]';
    const saturatedFatsDisplaySelector = '[data-saturated-fats-display]';
    const proteinDisplaySelector = '[data-protein-display]';
    const fibersDisplaySelector = '[data-fibers-display]';
    const saltsDisplaySelector = '[data-salts-display]';

    const revertButtonSelector = '.revert-button';

    const checkboxTextSelector = '[data-checkbox-text]';
    const checkboxTextHoverSelector = '[data-checkbox-text-hover]';


    // Queries
    const servingSizeTopWrapEl = queryFn(section, servingSizeTopWrapSelector);
    const servingSizeDisplayEl = queryFn(section, servingSizeDisplaySelector);

    const servingSizeInputEl = queryFn(section, servingSizeInputSelector);
    const perServingInputEl = queryFn(section, perServingInputSelector);
    const totalInputEl = queryFn(section, totalServingInputSelector);

    const servingSizeLockButtonEl = queryFn(section, servingSizeLockButtonSelector);
    const perServingLockButtonEl = queryFn(section, perServingLockButtonSelector);
    const totalServingLockButtonEl = queryFn(section, totalServingLockButtonSelector);

    const caloriesDisplayEl = queryFn(section, caloriesDisplaySelector);
    const carbsDisplayEl = queryFn(section, carbsDisplaySelector);
    const sugarsDisplayEl = queryFn(section, sugarsDisplaySelector);
    const fatsDisplayEl = queryFn(section, fatsDisplaySelector);
    const saturatedFatsDisplayEl = queryFn(section, saturatedFatsDisplaySelector);
    const proteinDisplayEl = queryFn(section, proteinDisplaySelector);
    const fibersDisplayEl = queryFn(section, fibersDisplaySelector);
    const saltsDisplayEl = queryFn(section, saltsDisplaySelector);

    const revertButtonEl = queryFn(section, revertButtonSelector);

    const checkboxTextEls = queryFn(section, checkboxTextSelector, { all: true });
    const checkboxTextHoverEls = queryFn(section, checkboxTextHoverSelector, { all: true });

    if (!servingSizeTopWrapEl || !servingSizeDisplayEl || !servingSizeInputEl || !perServingInputEl || !totalInputEl ||
      !servingSizeLockButtonEl || !perServingLockButtonEl || !totalServingLockButtonEl ||
      !caloriesDisplayEl || !carbsDisplayEl || !sugarsDisplayEl || !fatsDisplayEl ||
      !saturatedFatsDisplayEl || !proteinDisplayEl || !fibersDisplayEl || !saltsDisplayEl || !revertButtonEl
    ) { return; }


    // Computed - Stale
    const origServingSize = parseFloat((servingSizeInputEl as HTMLInputElement).value);
    const origPerServing = parseFloat((perServingInputEl as HTMLInputElement).value);
    const origTotal = parseFloat((totalInputEl as HTMLInputElement).value);

    const origCalories = parseFloat(caloriesDisplayEl.textContent);
    const origCarbs = parseFloat(carbsDisplayEl.textContent);
    const origSugars = parseFloat(sugarsDisplayEl.textContent);
    const origFats = parseFloat(fatsDisplayEl.textContent);
    const origSaturatedFats = parseFloat(saturatedFatsDisplayEl.textContent);
    const origProtein = parseFloat(proteinDisplayEl.textContent);
    const origFibers = parseFloat(fibersDisplayEl.textContent);
    const origSalts = parseFloat(saltsDisplayEl.textContent);

    const origCheckboxStrings = checkboxTextEls ? Array.from(checkboxTextEls).map(el => el.textContent) : [];


    // Events
    // Events - Inputs
    servingSizeInputEl.addEventListener('input', () => {
      updateInputs('servingSize');
    });

    perServingInputEl.addEventListener('input', () => {
      updateInputs('perServing');
    });
    
    totalInputEl.addEventListener('input', () => {
      updateInputs('total');
    });

    // Events - Lock Buttons
    servingSizeLockButtonEl.addEventListener('click', () => {
      updateInputLocks('servingSize');
    });

    perServingLockButtonEl.addEventListener('click', () => {
      updateInputLocks('perServing');
    });

    totalServingLockButtonEl.addEventListener('click', () => {
      updateInputLocks('total');
    });

    revertButtonEl.addEventListener('click', () => {
      if (shouldShowRevertButton()) {
        resetAll();
        showRevertButton(false);
      }
    });


    // Functions
    function resetAll() {
      resetInputLocks();
      resetButtonLocks();
      resetInputValues();
      resetNutrition();
      updateCheckboxTexts();
      showRevertButton(false);
    }

    // Lock the clicked button and enable the others
    // Same goes for the inputs
    function updateInputLocks(
      valueChanged: 'servingSize' | 'perServing' | 'total'
    ) {
      unlockAllButtons();
      unlockAllInputs();

      switch (valueChanged) {
        case 'servingSize':
          servingSizeTopWrapEl!.classList.add('disabled');
          (servingSizeLockButtonEl as HTMLButtonElement).disabled = true;
          (servingSizeInputEl as HTMLInputElement).disabled = true;
          break;
        case 'perServing':
          (perServingLockButtonEl as HTMLButtonElement).disabled = true;
          (perServingInputEl as HTMLInputElement).disabled = true;
          break;
        case 'total':
          (totalServingLockButtonEl as HTMLButtonElement).disabled = true;
          (totalInputEl as HTMLInputElement).disabled = true;
          break;
      }
    }

    // The formula is: total = servingSize * perServing
    function updateInputs(
      valueChanged: 'servingSize' | 'perServing' | 'total'
    ) {
      const { servingSize, perServing, total } = getInputValues();

      showRevertButton(shouldShowRevertButton());

      switch (valueChanged) {
        case 'servingSize':
          // Check if total isn't disabled and set it, otherwise update perServing
          if (!(totalInputEl as HTMLInputElement).disabled) {
            const newValue = reactInputValue((servingSize * perServing));

            (totalInputEl as HTMLInputElement).value = newValue.toString();
            updateCheckboxTexts();
          } else if (!(perServingInputEl as HTMLInputElement).disabled) {
            const newValue = reactInputValue((total / servingSize));

            (perServingInputEl as HTMLInputElement).value = newValue.toString();
            updateNutrition();
          }
          break;
        case 'perServing':
          // Check if servingSize isn't disabled and set it, otherwise update total
          if (!(servingSizeInputEl as HTMLInputElement).disabled) {
            const newValue = reactInputValue((total / perServing), 2);

            (servingSizeInputEl as HTMLInputElement).value = newValue.toString();
          } else if (!(totalInputEl as HTMLInputElement).disabled) {
            const newValue = reactInputValue((perServing * servingSize));

            (totalInputEl as HTMLInputElement).value = newValue.toString();
            updateCheckboxTexts();
          }
          updateNutrition();
          break;
        case 'total':
          // Check if perServing isn't disabled and set it, otherwise update servingSize
          if (!(perServingInputEl as HTMLInputElement).disabled) {
            const newValue = reactInputValue((total / servingSize));

            (perServingInputEl as HTMLInputElement).value = newValue.toString();
            updateNutrition();
          } else if (!(servingSizeInputEl as HTMLInputElement).disabled) {
            const newValue = reactInputValue((total / perServing), 2);

            (servingSizeInputEl as HTMLInputElement).value = newValue.toString();
          }
          updateCheckboxTexts();
          break;
      }
    }


    // The original values corespond to the original perServing
    function updateNutrition() {
      const { perServing } = getInputValues();

      caloriesDisplayEl!.textContent = calculateNutritionValue(origCalories, origPerServing, perServing).toString();
      carbsDisplayEl!.textContent = calculateNutritionValue(origCarbs, origPerServing, perServing).toString();
      sugarsDisplayEl!.textContent = calculateNutritionValue(origSugars, origPerServing, perServing).toString();
      fatsDisplayEl!.textContent = calculateNutritionValue(origFats, origPerServing, perServing).toString();
      saturatedFatsDisplayEl!.textContent = calculateNutritionValue(origSaturatedFats, origPerServing, perServing).toString();
      proteinDisplayEl!.textContent = calculateNutritionValue(origProtein, origPerServing, perServing).toString();
      fibersDisplayEl!.textContent = calculateNutritionValue(origFibers, origPerServing, perServing).toString();
      saltsDisplayEl!.textContent = calculateNutritionValue(origSalts, origPerServing, perServing).toString();
    }


    // Update all the numbers based on the original total and total values
    function updateCheckboxTexts() {
      if (!checkboxTextEls || !checkboxTextHoverEls || origCheckboxStrings.length == 0) return;
      const { total } = getInputValues();

      origCheckboxStrings.forEach((origString, index) => {
        const el = checkboxTextEls[index];
        const hoverEl = checkboxTextHoverEls[index];

        // Find all the numbers in the text content
        const numbers = origString.match(/\d+(\.\d+)?/g);

        if (!numbers) return;

        const updatedNumbers = numbers.map(num => {
          let parsedNum = parseFloat(num);
          if (isNaN(parsedNum)) parsedNum = 0;

          // Original number / original total * new total
          // And round to 1 decimal point
          const updatedNum = Math.round((parsedNum / origTotal * total) * 10) / 10;
          return updatedNum.toString();
        });

        // Replace the numbers in the original string with the updated numbers
        let updatedString = origString;
        numbers.forEach((num, i) => {
          updatedString = updatedString.replace(num, updatedNumbers[i]);
        });

        // Update the text content of the elements
        el.textContent = updatedString;
        hoverEl.textContent = updatedString;
      });
    }


    // Helpers
    function reactInputValue(
      newValue: number, roundTo: number = 0
    ): number {
      let result = newValue;

      if (isNaN(result)) result = 0;

      // Round to the specified number of decimal places before returning
      const factor = Math.pow(10, roundTo);
      result = Math.round(result * factor) / factor;
      return result;
    }

    function calculateNutritionValue(origValue: number, origPerServing: number, perServing: number): number {
      let newValue = origValue / origPerServing * perServing;

      if (isNaN(newValue)) newValue = 0;

      // Round to 1 decimal place
      newValue = Math.round(newValue * 10) / 10;
      return newValue;
    }

    function showRevertButton(show: boolean) {
      if (show) {
        revertButtonEl!.classList.add(revertButtonActiveClass);
      } else {
        revertButtonEl!.classList.remove(revertButtonActiveClass);
      }
    }

    function shouldShowRevertButton(): boolean {
      // Check if the revert button is currently active
      if (revertButtonEl!.classList.contains(revertButtonActiveClass)) {
        return true;
      }

      // Check if any of the input values have changed from their original values
      const { servingSize, perServing, total } = getInputValues();
      if (servingSize !== origServingSize || perServing !== origPerServing || total !== origTotal) {
        return true;
      }

      return false;
    }

    function unlockAllButtons() {
      servingSizeTopWrapEl!.classList.remove('disabled');
      (servingSizeLockButtonEl as HTMLButtonElement).disabled = false;
      (perServingLockButtonEl as HTMLButtonElement).disabled = false;
      (totalServingLockButtonEl as HTMLButtonElement).disabled = false;
    }

    function unlockAllInputs() {
      (servingSizeInputEl as HTMLInputElement).disabled = false;
      (perServingInputEl as HTMLInputElement).disabled = false;
      (totalInputEl as HTMLInputElement).disabled = false;
    }

    function getInputValues(): { servingSize: number; perServing: number; total: number } {
      return {
        servingSize: parseFloat((servingSizeInputEl as HTMLInputElement).value),
        perServing: parseFloat((perServingInputEl as HTMLInputElement).value),
        total: parseFloat((totalInputEl as HTMLInputElement).value)
      };
    }

    // Helpers - Reset
    function resetNutrition() {
      caloriesDisplayEl!.textContent = origCalories.toString();
      carbsDisplayEl!.textContent = origCarbs.toString();
      sugarsDisplayEl!.textContent = origSugars.toString();
      fatsDisplayEl!.textContent = origFats.toString();
      saturatedFatsDisplayEl!.textContent = origSaturatedFats.toString();
      proteinDisplayEl!.textContent = origProtein.toString();
      fibersDisplayEl!.textContent = origFibers.toString();
      saltsDisplayEl!.textContent = origSalts.toString();
    }

    function resetInputValues() {
      (servingSizeInputEl as HTMLInputElement).value = origServingSize.toString();
      (perServingInputEl as HTMLInputElement).value = origPerServing.toString();
      (totalInputEl as HTMLInputElement).value = origTotal.toString();
    }

    function resetButtonLocks() {
      unlockAllButtons();
      (perServingLockButtonEl as HTMLButtonElement).disabled = true;
    }

    function resetInputLocks() {
      unlockAllInputs();
      (perServingInputEl as HTMLInputElement).disabled = true;
    }
  });
}