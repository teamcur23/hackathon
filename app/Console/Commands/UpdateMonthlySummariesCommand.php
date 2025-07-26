<?php

namespace App\Console\Commands;

use App\Models\MonthlySummary;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdateMonthlySummariesCommand extends Command
{
    protected $signature = 'summaries:update {--user-id= : Update for specific user} {--month= : Update for specific month (YYYY-MM)}';
    protected $description = 'Update monthly summaries for all users or specific user/month';

    public function handle(): int
    {
        $userId = $this->option('user-id');
        $month = $this->option('month');

        if ($userId) {
            $users = User::where('id', $userId)->get();
        } else {
            $users = User::all();
        }

        if ($month) {
            $date = Carbon::parse($month);
            $months = [['year' => $date->year, 'month' => $date->month]];
        } else {
            // Update last 3 months
            $months = [];
            for ($i = 0; $i < 3; $i++) {
                $date = now()->subMonths($i);
                $months[] = ['year' => $date->year, 'month' => $date->month];
            }
        }

        $this->info('Updating monthly summaries...');
        $progressBar = $this->output->createProgressBar($users->count() * count($months));

        foreach ($users as $user) {
            foreach ($months as $monthData) {
                MonthlySummary::updateForUser($user->id, $monthData['year'], $monthData['month']);
                $progressBar->advance();
            }
        }

        $progressBar->finish();
        $this->newLine();
        $this->info('Monthly summaries updated successfully!');

        return 0;
    }
}
