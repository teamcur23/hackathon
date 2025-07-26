<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\Receipt;
use App\Policies\ReceiptPolicy;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
        Gate::policy(Receipt::class, ReceiptPolicy::class);

        // Ensure storage link exists
        if (!file_exists(public_path('storage'))) {
            $this->app->make('files')->link(
                storage_path('app/public'),
                public_path('storage')
            );
        }
    }
}
