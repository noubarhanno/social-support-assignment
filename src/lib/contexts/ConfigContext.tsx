import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from "react";
import { saveToStorage, loadFromStorage } from "../utils/storage";
import { STORAGE_KEYS } from "../utils/constants";

/**
 * Wizard step numbers (0-based, 3 = completed)
 */
export type WizardStep = 0 | 1 | 2 | 3;

/**
 * Config reducer actions
 */
export type ConfigAction = "SET_WIZARD_STEP" | "RESET_WIZARD";

/**
 * Config context state
 */
export type ConfigState = {
  wizardStep: WizardStep;
};

/**
 * Config context consumer type
 */
type ConfigContextConsumer = {
  state: ConfigState;
  dispatch: React.Dispatch<{
    type: ConfigAction;
    payload: Partial<ConfigState>;
  }>;
};

const ConfigContext = createContext({} as ConfigContextConsumer);

/**
 * Config Context Provider Props
 */
interface ConfigContextProviderProps {
  children: React.ReactNode;
}

/**
 * ConfigContext Provider component that manages wizard step state with localStorage persistence
 */
const ConfigContextProvider: React.FC<ConfigContextProviderProps> = ({
  children,
}) => {
  /**
   * Reducer function for ConfigContext state management
   * @param state - The current state
   * @param action - The action to dispatch
   * @returns The new state
   */
  const reducer = (
    state: ConfigState,
    action: { type: ConfigAction; payload: Partial<ConfigState> }
  ): ConfigState => {
    switch (action.type) {
      case "SET_WIZARD_STEP":
        return {
          ...state,
          wizardStep: action.payload.wizardStep ?? state.wizardStep,
        };
      case "RESET_WIZARD":
        return {
          ...state,
          wizardStep: 0,
        };
      default:
        return state;
    }
  };

  /**
   * Initialize the reducer with state loaded from localStorage
   */
  const [state, dispatch] = useReducer(reducer, {
    wizardStep: loadFromStorage<WizardStep>(STORAGE_KEYS.WIZARD_PROGRESS, 0),
  });

  /**
   * Persist wizard step to localStorage whenever it changes
   */
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.WIZARD_PROGRESS, state.wizardStep);
  }, [state.wizardStep]);

  /**
   * Memoize the context value to prevent unnecessary re-renders
   */
  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state]
  );

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};

export default ConfigContextProvider;

/**
 * Hook to use ConfigContext
 * @returns ConfigContext consumer with state and dispatch
 */
export function useConfigContext(): ConfigContextConsumer {
  const context = useContext(ConfigContext);

  if (!context.state && !context.dispatch) {
    throw new Error(
      "useConfigContext must be used within a ConfigContextProvider"
    );
  }

  return context;
}

/**
 * Hook to manage wizard step navigation
 */
export function useWizardNavigation() {
  const { state, dispatch } = useConfigContext();

  const setWizardStep = useMemo(
    () => (wizardStep: WizardStep) => {
      dispatch({
        type: "SET_WIZARD_STEP",
        payload: { wizardStep },
      });
    },
    [dispatch]
  );

  const resetWizard = useMemo(
    () => () => {
      dispatch({
        type: "RESET_WIZARD",
        payload: {},
      });
    },
    [dispatch]
  );

  const nextStep = useMemo(
    () => () => {
      if (state.wizardStep < 2) {
        setWizardStep((state.wizardStep + 1) as WizardStep);
      }
    },
    [state.wizardStep, setWizardStep]
  );

  const previousStep = useMemo(
    () => () => {
      if (state.wizardStep > 0) {
        setWizardStep((state.wizardStep - 1) as WizardStep);
      }
    },
    [state.wizardStep, setWizardStep]
  );

  return {
    wizardStep: state.wizardStep,
    setWizardStep,
    resetWizard,
    nextStep,
    previousStep,
  };
}
