
export function forceCloseModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    if (modalElement && (window as any).bootstrap) {
        const modalInstance = (window as any).bootstrap.Modal.getInstance(modalElement)
            || new (window as any).bootstrap.Modal(modalElement);
        modalInstance.hide();
    }

    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');
}