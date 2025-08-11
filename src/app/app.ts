import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
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
  loaderVisible = false;
  private loadingSubscription!: Subscription;
  private cd = inject(ChangeDetectorRef);
  loaderService = inject(LoaderService);

  ngOnInit(): void {
    this.loadingSubscription = this.loaderService.loading$.subscribe(
      (isLoading: boolean) => {
        setTimeout(() => {
          this.loaderVisible = isLoading;
          this.cd.detectChanges();
        });
      }
    );
  }

  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }

  showLoader(): void {
    this.loaderService.show();
  }

  // Método de ejemplo para ocultar el loader manualmente
  hideLoader(): void {
    this.loaderService.hide();
  }
}
