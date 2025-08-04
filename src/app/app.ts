import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FullLoader } from "./shared/components/full-loader/full-loader";
import { LoaderService } from './services/loader-service';
import { Subscription } from 'rxjs';
import { ToastContainerDirective } from 'ngx-toastr';


@Component({
  selector: 'app-root',
  standalone:true,
  imports: [RouterOutlet, FullLoader, ToastContainerDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
 protected title = 'GestioraFront';
  loaderVisible = false;
  loaderService = inject(LoaderService);
  private loadingSubscription!: Subscription;

  ngOnInit(): void {
    // Suscribirse al observable del servicio
    this.loadingSubscription = this.loaderService.loading$.subscribe(
      (isLoading: boolean) => {
        this.loaderVisible = isLoading;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  // Método de ejemplo para mostrar el loader manualmente
  showLoader(): void {
    this.loaderService.show();
  }

  // Método de ejemplo para ocultar el loader manualmente
  hideLoader(): void {
    this.loaderService.hide();
  }
}
