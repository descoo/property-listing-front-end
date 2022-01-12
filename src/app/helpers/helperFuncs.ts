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

export function displayCustomMessage(
  message: string,
  timer: number = 1500
): void {
  Swal.fire({
    position: 'top',
    title: message,
    width: 400,
    padding: '2em',
    showConfirmButton: false,
    backdrop: 'rgba(0,0,0,0.1)',
    timer: timer,
  });
}
