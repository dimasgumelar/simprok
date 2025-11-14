<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Inventory extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'inventory_code',
        'name',
        'brand',
        'category_id',
        'transmission_id',
        'photo_path',
        'description',
        'received_at',
        'condition',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function transmission()
    {
        return $this->belongsTo(Transmission::class);
    }


}