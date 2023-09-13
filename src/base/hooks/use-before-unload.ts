import { useCallback, useEffect } from 'react';

/**
 * Creates a hook that adds a 'beforeunload' event listener to the window object.
 * The hook prompts the user for confirmation when attempting to navigate away or close the tab.
 * The behavior can be toggled using the `isEnabled` parameter.
 *
 * @param {boolean} isEnabled - Determines whether the beforeunload event is active.
 *                              Defaults to true.
 * @returns {void}
 */
export const useBeforeUnload = (isEnabled: boolean = true): void => {
  const handleTabClose = useCallback(
    (event: BeforeUnloadEvent) => {
      // If returns null or undefined, It won't prompt to confirm the page unload
      if (!isEnabled) return null;

      // Cancel the event as a standard approach
      event.preventDefault();
      /**
       * Since Chrome does not support `event.preventDefault()` for 'beforeunload' events,
       * setting event.returnValue to an empty string will prompt the user for confirmation.
       * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#compatibility_notes
       */
      return (event.returnValue = '');
    },
    [isEnabled],
  );

  useEffect(() => {
    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [handleTabClose]);
};
