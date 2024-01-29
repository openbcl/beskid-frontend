import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private messageService: MessageService) { }

  toastSuccess(summary: string, detail?: string) {
    this.messageService.add({severity: 'success', summary, detail});
  }

  toastInfo(summary: string, detail?: string) {
    this.messageService.add({severity: 'info', summary, detail});
  }

  toastWarn(summary: string, detail?: string) {
    this.messageService.add({severity: 'warn', summary, detail});
  }

  toastError(summary: string, detail?: string) {
    this.messageService.add({severity: 'error', summary, detail, life: 30000});
  }
}
