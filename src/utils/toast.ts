// Toast utility functions
export const showToast = (message: string, type: 'error' | 'success' | 'warning' | 'info' = 'error') => {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  // Add to DOM
  document.body.appendChild(toast);

  // Show with animation
  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  // Auto hide after 4 seconds for success, 6 seconds for error
  const hideDelay = type === 'success' ? 3000 : 5000;
  
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.remove();
        }
      }, 300);
    }
  }, hideDelay);

  // Allow manual close on click
  toast.addEventListener('click', () => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 300);
  });
};