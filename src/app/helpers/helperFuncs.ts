import Swal, { SweetAlertIcon } from 'sweetalert2';

export function displayMessage(
  icon: SweetAlertIcon,
  message: string,
  timer: number = 1500
): void {
  Swal.fire({
    position: 'top',
    icon: icon,
    title: message,
    showConfirmButton: false,
    timer: timer,
  });
}
