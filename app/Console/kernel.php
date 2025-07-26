<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        Commands\UpdateMonthlySummariesCommand::class,
    ];

    protected function schedule(Schedule $schedule): void
    {
        // Update monthly summaries daily at 2 AM
        $schedule->command('summaries:update')->dailyAt('02:00');

        // Clean up old failed jobs
        $schedule->command('queue:prune-failed --hours=48')->daily();
    }

    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}
