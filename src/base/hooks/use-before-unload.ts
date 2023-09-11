import { useCallback, useEffect } from 'react';

/**
 * Creates a hook that adds a 'beforeunload' event listener to the window object.
 * The hook prompts the user for confirmation when attempting to navigate away or close the tab.
 *
 * @returns {void}
 */
export const useBeforeUnload = (): void => {
  const handleTabClose = useCallback((event: BeforeUnloadEvent) => {
    event.preventDefault(); // Cancel the event as a standard approach
    /**
     * Since Chrome does not support `event.preventDefault()` for 'beforeunload' events,
     * setting event.returnValue to an empty string will prompt the user for confirmation.
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#compatibility_notes
     */
    return (event.returnValue = '');
  }, []);

  useEffect(() => {
    window.addEventListener('beforeunload', handleTabClose);

    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, [handleTabClose]);
};
