import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert-popup.component.html',
  styleUrls: ['./alert-popup.component.css']
})
export class AlertPopupComponent {
  @Input() visible: boolean = false;
  @Input() message: string = '';
  @Input() showConfirm: boolean = false;

  @Output() okClick = new EventEmitter<void>();      // For OK button press
  @Output() cancelClick = new EventEmitter<void>();  // For Cancel button press

  onConfirmClick() {
    this.okClick.emit();  // OK click for confirm dialog
  }

  onOkClick() {
    this.okClick.emit();  // OK click for simple alert popup
  }

  onCancelClick() {
    this.cancelClick.emit();  // Cancel click
  }
}
