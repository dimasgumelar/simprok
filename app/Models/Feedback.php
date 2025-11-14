<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $table = 'feedbacks';
    protected $fillable = [
        'maintenance_id',
        'description',
        'file_path',
    ];

    public function maintenance()
    {
        return $this->belongsTo(Maintenance::class);
    }
}