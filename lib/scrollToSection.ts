export const scrollToSection = (
  hash: string, 
  options: {
    headerOffset?: number;
    delay?: number;
    maxAttempts?: number;
    retryInterval?: number;
    onSuccess?: () => void;
    onError?: (hash: string) => void;
  } = {}
) => {
  const {
    headerOffset = 100,
    delay = 100,
    maxAttempts = 20,
    retryInterval = 200,
    onSuccess,
    onError
  } = options;

  const attemptScroll = (attempts = 0) => {
    const targetElement = document.getElementById(hash);

    if (targetElement) {
      setTimeout(() => {
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
        
        if (onSuccess) {
          onSuccess();
        }
      }, delay);
      
      return true;
    } else if (attempts < maxAttempts) {
      setTimeout(() => attemptScroll(attempts + 1), retryInterval);
      return false;
    } else {
      if (onError) {
        onError(hash);
      }
      
      return false;
    }
  };

  if (document.readyState === 'complete') {
    attemptScroll();
  } else {
    window.addEventListener('load', () => {
      attemptScroll();
    });
  }
};

export const useHashScroll = (pathname: string, isHomepage: boolean) => {
  if (typeof window === 'undefined') return;

  if (isHomepage && window.location.hash) {
    const hash = window.location.hash.substring(1);
    
    setTimeout(() => {
      scrollToSection(hash, {
      });
    }, 100);
  }
};