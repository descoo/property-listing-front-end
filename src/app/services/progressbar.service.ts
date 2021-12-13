import { Injectable } from '@angular/core';
import { NgProgressRef } from 'ngx-progressbar';

@Injectable({
  providedIn: 'root',
})
export class ProgressbarService {
  progressRef!: NgProgressRef;
  defaultColor: string = '#1B95E0';
  successColor: string = '#13ff26';
  errorColor: string = '#ff1313';
  currentColor: string = this.defaultColor;
  showSuccess: boolean = false;
  showError: boolean = false;

  constructor() {}

  startLoading() {
    this.currentColor = this.defaultColor;
    this.progressRef.start();
  }

  completeLoading() {
    this.progressRef.complete();
  }

  setSuccess(): void {
    this.currentColor = this.successColor;
  }
  setError(): void {
    this.currentColor = this.errorColor;
  }

  setShowSuccess(): void {
    this.showSuccess = true;
  }

  setShowError(): void {
    this.showError = true;
  }
  setShowDefaults(): void {
    this.showSuccess = false;
    this.showError = false;
  }
}
