import { Injectable } from '@angular/core';
import { NgProgressRef } from 'ngx-progressbar';

@Injectable({
  providedIn: 'root',
})
export class ProgressbarService {
  progressRef!: NgProgressRef;
  defaultColor = '#1B95E0';
  successColor = '#13ff26';
  errorColor = '#ff1313';
  currentColor = this.defaultColor;
  showSuccess = false;
  showError = false;

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
