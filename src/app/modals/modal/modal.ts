import { Component, Inject, Type, ViewChild, ViewContainerRef, OnInit, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface ModalData {
  component: Type<any>;
  width?: string;
  height?: string;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})
export class Modal implements OnInit {
  @ViewChild('modalContent', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;

  constructor(
    private dialogRef: MatDialogRef<Modal>,
    private elementRef: ElementRef<HTMLElement>,
    @Inject(MAT_DIALOG_DATA) public data: ModalData
  ) {}

  ngOnInit(): void {
    this.container.clear();
    this.container.createComponent(this.data.component);

    const hostElement = this.elementRef.nativeElement.closest('mat-dialog-container') as HTMLElement | null;
    if (hostElement) {
      if (this.data?.width) {
        hostElement.style.width = this.data.width;
      }
      if (this.data?.height) {
        hostElement.style.height = this.data.height;
      }
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
